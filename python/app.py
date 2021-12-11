from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import pymysql
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import time
import requests
import os
import numpy as np
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'thisissecret'
path = os.getcwd()
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + path + '/stock.db'


db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(50))
    password = db.Column(db.String(50))


class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    strategy_one = db.Column(db.String(50))
    strategy_two = db.Column(db.String(50))
    strategy_count = db.Column(db.Integer)
    date = db.Column(db.Date)
    user_id = db.Column(db.Integer)
    money = db.Column(db.Integer)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'Token is required.'})
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except Exception as e:
            return jsonify({'message': 'Token is invalid'}), 401
        print(current_user)
        return f(current_user, *args, **kwargs)
    return decorated


@app.route('/')
def index():
    return 'hello world'


@app.route('/user', methods= ['POST'])
def create_user():
    data = request.get_json()

    hashedPassword = generate_password_hash(data['password'], method = 'sha256')

    new_user = User(public_id=str(uuid.uuid4()), email = data['email'], password = hashedPassword)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'new user created'})


@app.route('/signin', methods = ['POST'])
def sign_in():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('could not verify', 401, {'WWW-Authenticate': 'Basic realm-"login required"'})
    user = User.query.filter_by(email = auth.username).first()

    if not user:
        return jsonify({'message': 'No user found.'})
    if check_password_hash(user.password, auth.password):
        token = jwt.encode({'public_id': user.public_id}, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token})
    return make_response('could not verify', 401, {'WWW-Authenticate': 'Basic realm-"login required"'})


@app.route('/portfolio', methods=['POST'])
@token_required
def create_portfolio(current_user):
    data = request.get_json()

    date = datetime.datetime.now()
    if len(data['strategy']) > 1:
        portfolio = Portfolio(strategy_one= data['strategy'][0], strategy_two= data['strategy'][1], strategy_count = 2,
                              date = date, user_id = current_user.public_id, money = data['money'])
        db.session.add(portfolio)
        db.session.commit()
    else:
        portfolio = Portfolio(strategy_one=data['strategy'][0], strategy_two="", date=date, strategy_count = 1,
                              user_id=current_user.public_id, money=data['money'])
        db.session.add(portfolio)
        db.session.commit()

    return jsonify({"message": "Created new portfolio"})


@app.route('/portfolio', methods=['GET'])
@token_required
def get_all_portfolios(current_user):
    portfolios = Portfolio.query.filter_by(user_id=current_user.public_id).all()
    # print(portfolios)

    output = {}

    for portfolio in portfolios:
        output[portfolio.id] = {}
        if portfolio.strategy_count == 1:
            output[portfolio.id][portfolio.strategy_one] = {}
            output[portfolio.id][portfolio.strategy_one] = calculateGrowth(portfolio.strategy_one, portfolio.date, portfolio.money)
            output[portfolio.id]["portfolio_cash_total"] = output[portfolio.id][portfolio.strategy_one]["cash"]
            output[portfolio.id]["portfolio_stock_total"] = output[portfolio.id][portfolio.strategy_one]["current_value_of_stocks"]
            output[portfolio.id]["portfolio_value_total"] = output[portfolio.id]["portfolio_cash_total"] + output[portfolio.id]["portfolio_stock_total"]
            output[portfolio.id]["strategies"] = [portfolio.strategy_one]
        else:
            output[portfolio.id][portfolio.strategy_one] = {}
            output[portfolio.id][portfolio.strategy_two] = {}
            output[portfolio.id][portfolio.strategy_one] = calculateGrowth(portfolio.strategy_one, portfolio.date, portfolio.money/2)
            output[portfolio.id][portfolio.strategy_two] = calculateGrowth(portfolio.strategy_two, portfolio.date, portfolio.money/2)
            output[portfolio.id]["portfolio_cash_total"] = output[portfolio.id][portfolio.strategy_one]["cash"] + output[portfolio.id][portfolio.strategy_two]["cash"]
            output[portfolio.id]["portfolio_stock_total"] = output[portfolio.id][portfolio.strategy_one]["current_value_of_stocks"] + output[portfolio.id][portfolio.strategy_two]["current_value_of_stocks"]
            output[portfolio.id]["portfolio_value_total"] = output[portfolio.id]["portfolio_cash_total"] + output[portfolio.id]["portfolio_stock_total"]
            output[portfolio.id]["strategies"] = [portfolio.strategy_one, portfolio.strategy_two]
    return jsonify({"portfolios": output})


def calculateGrowth(strategy, portfolio_date, portfolio_money):
    stocks = ""
    if strategy == "growth":
            stocks = 'TSLA,FB,CRM'
    if strategy == "index":
            stocks = 'VTI,IXUS,ILTB'
    if strategy == "quality":
            stocks = 'MS,UNH,HD'
    if strategy == "value":
            stocks = 'PG,JNJ,DIS'
    if strategy == "ethical":
            stocks = 'AAPL,ADBE,NSRGY'
    changes = get_stock_info(stocks, portfolio_date, portfolio_money)

    return changes


def get_stock_info(code, date, total_invested):
    url = "https://yfapi.net/v8/finance/spark"
    range = datetime.datetime.now() - datetime.datetime.combine(date, datetime.datetime.min.time())
    range_in_days = divmod(range.total_seconds(), 86400)[0]  
    querystring = {"symbols": code, "interval": "1d", "range": str(int(range_in_days)) + "d"}
    headers = {
        # 'x-api-key': "JNffZ9JMRw5XOSiMuRwa72FMtCcTjAj7as6kexGU"
        # 'x-api-key': "SB3fKNRnSg7S8RWXtvHvo61jFs4DGnD55NKQL22s"
        # 'x-api-key': "HDZxdRoLLA7UCL6A5ypin1gkPNvbTyxU79Aqsm7W"
        # 'x-api-key': "Vg0KHjoaBe8JmzV41HfshahstRrQZhqr222KRUea"
        # 'x-api-key': "mCBny7lXno4AUeYSmD4pw9RuqfK6HyS9GShUMqEd"
        
        'x-api-key': "POgErlwRXg19RNS4q870G3wpO6UBf8hs1CxPAaWz"
    }
    output = {}
    cost_per_bundle = 0
    current_price_per_bundle = 0
    try:
        response = requests.request("GET", url, headers=headers, params=querystring)
        # print(response.text)
        stocks = response.json()
        for stock in stocks:
            output[stock] = {}
            cost_per_bundle += stocks[stock]['close'][0]
            current_price_per_bundle += stocks[stock]['close'][-1]

            output[stock]['original_cost'] = stocks[stock]['close'][0]
            output[stock]['current_price'] = stocks[stock]['close'][-1]
            output[stock]['close_prices'] = stocks[stock]['close']
            output[stock]['growth'] = 100 * (stocks[stock]['close'][-1] - stocks[stock]['close'][0]) /stocks[stock]['close'][0]
        
        bundles = total_invested // cost_per_bundle

        for stock in stocks:
            output[stock]['stock_count'] = bundles

        cash = total_invested - bundles * cost_per_bundle
        current_value = bundles * current_price_per_bundle
        output['cash'] = cash
        output['current_value_of_stocks'] = current_value
        output['current_strategy_value'] = current_value + cash
        output['strategy_bundle_count'] = bundles

    except requests.exceptions.RequestException as e:
        print("An error has occurred.", e)
    return output


@app.route('/trend', methods=['POST'])
def get_trend():
    data = request.get_json()
    stocks = ""
    five_days_ago = (datetime.datetime.now() - datetime.timedelta(days=5)).date()
    portfolio = Portfolio.query.filter_by(id=data['portfolio_id']).first()

    result = {}
    ls = ['cash', 'current_value_of_stocks', 'current_strategy_value', 'strategy_bundle_count']
    trend = []
    if portfolio.strategy_count == 2:
        result[portfolio.strategy_one] = calculateGrowth(portfolio.strategy_one, five_days_ago, portfolio.money/2)
        result[portfolio.strategy_two] = calculateGrowth(portfolio.strategy_two, five_days_ago, portfolio.money/2)

        price_list = [0.0,0.0,0.0,0.0,0.0]

        for key in result[portfolio.strategy_one].keys():
            if key not in ls:
                price_list = np.add(price_list, result[portfolio.strategy_one][key]["close_prices"]).tolist()
        trend = np.multiply(price_list, result[portfolio.strategy_one]['strategy_bundle_count']).tolist()
        trend = np.add(trend, result[portfolio.strategy_one]['cash']).tolist()

        price_list_two = [0.0, 0.0, 0.0, 0.0, 0.0]
        for key in result[portfolio.strategy_two].keys():
            if key not in ls:
                price_list_two = np.add(price_list_two, result[portfolio.strategy_two][key]["close_prices"]).tolist()
        trend_two = np.multiply(price_list_two, result[portfolio.strategy_two]['strategy_bundle_count']).tolist()
        trend = np.add(trend, trend_two).tolist()
        trend = np.add(trend, result[portfolio.strategy_two]['cash']).tolist()
    else:
        result[portfolio.strategy_one] = calculateGrowth(portfolio.strategy_one, five_days_ago, portfolio.money)

        price_list = [0.0, 0.0, 0.0, 0.0, 0.0]

        for key in result[portfolio.strategy_one].keys():
            if key not in ls:
                price_list = np.add(price_list, result[portfolio.strategy_one][key]["close_prices"]).tolist()
        trend = np.multiply(price_list, result[portfolio.strategy_one]['strategy_bundle_count']).tolist()
        trend = np.add(trend, result[portfolio.strategy_one]['cash']).tolist()

    return jsonify({"trend": trend})


if __name__ == "__main__":
    app.run(debug = True)