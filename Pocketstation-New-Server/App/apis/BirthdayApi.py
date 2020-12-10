# -*- coding: utf-8 -*-
import json

from flask import jsonify
from flask_restful import Resource, reqparse
from App.models import User, Point, db
import requests
from App.apis.TokenApi import logger
import datetime

year_ = datetime.datetime.now().year
month_ = datetime.datetime.now().month
day_ = datetime.datetime.now().day


class Birthday(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(name='points', type=int)
        parser.add_argument(name='user_id', type=int)
        parse = parser.parse_args()
        points = parse.get('points')
        user_id = parse.get('user_id')
        print(points)
        user = User.query.filter(User.id==user_id).first()
        if user and user.openid:
            point = Point.query.filter(Point.staff_id==user.id).first()
            print(point)
            if point:
                point.give = point.give + points
                db.session.commit()

                appid = 'wxc7cf4e85ecbf8282'
                secret = 'bafb0339afa3db639000a92ae15ff072'
                url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={}&secret={}'.format(
                    appid,
                    secret)
                response = requests.get(url)
                logger.info('post[%s]=>[%s][%s][%s]' % (
                    appid, secret, response.status_code, response.text
                ))
                resData = response.json()
                access_token = resData['access_token']

                u = User.query.filter(User.id==user_id).first()
                u_openid = u.openid

                url1 = 'https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token={}'.format(
                    access_token)
                response = requests.get(url1)
                logger.info('post[%s]=>[%s][%s]' % (
                    access_token, response.status_code, response.text
                ))
                resData = response.json()
                print(resData)

                openid = u_openid
                template_id = resData['template_list'][-2]['template_id']
                url = 'https://pocketstation.cn/'
                msg = {
                    "touser": openid,
                    "template_id": template_id,
                    "url": url,
                    "data": {
                        "first": {
                            "value": "积分赠送",
                            "color": "#000"
                        },
                        "keyword1": {
                            "value": '口袋加油站',
                            "color": "#000"
                        },
                        "keyword2": {
                            "value": points,
                            "color": "#000"
                        },
                        "keyword3": {
                            "value": points,
                            "color": "#000"
                        },
                        "keyword4": {
                            "value": str(year_) + '/' + str(month_) + '/' + str(day_),
                            "color": "#000"
                        },
                        "remark": {
                            "value": '祝您生日快乐！',
                            "color": "#000"
                        },
                    }
                }
                json_data = json.dumps(msg)
                url4 = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=%s' % access_token
                r = requests.post(url4, json_data)
                print(json.loads(r.text))
                return jsonify({'msg': 1})

            else:
                point = Point()
                point.staff_id = user_id
                point.total_points = points
                point.give = points
                point.level = '新兵'
                db.session.add(point)
                db.session.commit()

                appid = 'wxc7cf4e85ecbf8282'
                secret = 'bafb0339afa3db639000a92ae15ff072'
                url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={}&secret={}'.format(
                    appid,
                    secret)
                response = requests.get(url)
                logger.info('post[%s]=>[%s][%s][%s]' % (
                    appid, secret, response.status_code, response.text
                ))
                resData = response.json()
                access_token = resData['access_token']

                u = User.query.filter(User.id == user_id).first()
                u_openid = u.openid

                url1 = 'https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token={}'.format(
                    access_token)
                response = requests.get(url1)
                logger.info('post[%s]=>[%s][%s]' % (
                    access_token, response.status_code, response.text
                ))
                resData = response.json()
                print(resData)

                openid = u_openid
                template_id = resData['template_list'][-2]['template_id']
                url = 'https://pocketstation.cn/'
                msg = {
                    "touser": openid,
                    "template_id": template_id,
                    "url": url,
                    "data": {
                        "first": {
                            "value": "积分赠送",
                            "color": "#000"
                        },
                        "keyword1": {
                            "value": '口袋加油站',
                            "color": "#000"
                        },
                        "keyword2": {
                            "value": points,
                            "color": "#000"
                        },
                        "keyword3": {
                            "value": points,
                            "color": "#000"
                        },
                        "keyword4": {
                            "value": str(year_) + '/' + str(month_) + '/' + str(day_),
                            "color": "#000"
                        },
                        "remark": {
                            "value": '祝您生日快乐！',
                            "color": "#000"
                        },
                    }
                }
                json_data = json.dumps(msg)
                url4 = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=%s' % access_token
                r = requests.post(url4, json_data)
                print(json.loads(r.text))
                return jsonify({'msg': 1})

        else:
            return jsonify({'msg':0})

