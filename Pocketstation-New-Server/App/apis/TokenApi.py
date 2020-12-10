import logging

import requests
from flask import jsonify, make_response
from flask_restful import Resource, reqparse

from App.models import db, User, Admin, Dealer

logger = logging.getLogger('Weixin')


class TokenResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(name='email', type=str)
        parser.add_argument(name='type', type=str)
        parser.add_argument(name='password', type=str)
        parser.add_argument(name='openid', type=str)
        parser.add_argument(name='avatar', type=str)

        parse = parser.parse_args()
        email = parse.get('email')
        type = parse.get('type')
        password = parse.get('password')
        openid = parse.get('openid')
        avatar = parse.get('avatar')
        print(avatar)
        if type == 'staff':
            user = User.query.filter(User.email.__eq__(email)).first()
            if user:
                u = User.query.filter(User.email.__eq__(email),User.passwd.__eq__(password)).first()
                if u:
                    u.openid = openid
                    u.img_src = avatar
                    db.session.commit()
                    data = {
                        'msg': '4',
                        'user_info':{
                            'id':user.id,
                            'name':user.name,
                            'tel':user.tel,
                            'avatar':user.img_src,
                            'openid':user.openid,
                            'type':user.type
                        }
                    }
                    return jsonify(data)
                else:
                    data = {'msg':'3'}
                    return jsonify(data)
            else:
                data = {'msg':'2'}
                return jsonify(data)
        elif type == 'dealer':
            admin = Admin.query.filter(Admin.email==email).first()
            dealer = Dealer()
            if admin and admin.pwd == password:
                dealers = Dealer.query.filter(Dealer.openid==openid).first()
                if dealers:
                    dealers.openid = openid
                    dealers.admin_id = admin.id
                    db.session.commit()
                    data = {
                        'msg': '4',
                        'user_info': {
                            'id': admin.id,
                            'name': admin.name,
                            'password': admin.pwd,
                            'avatar': admin.avatar,
                            'openid': openid,
                            'type': admin.type
                        }
                    }
                    return jsonify(data)
                else:
                    dealer.openid = openid
                    dealer.admin_id = admin.id
                    db.session.add(dealer)
                    db.session.commit()
                    data = {
                        'msg': '4',
                        'user_info': {
                            'id': admin.id,
                            'name': admin.name,
                            'password': admin.pwd,
                            'avatar': admin.avatar,
                            'openid': openid,
                            'type': admin.type
                        }
                    }
                    return jsonify(data)
            elif admin and admin.pwd != password:
                data = {'msg': '3'}
                return jsonify(data)
            else:
                data = {'msg': '2'}
                return jsonify(data)
        else:
            return jsonify({})

class TokenResource1(Resource):
    pass
    def post(self):
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
        }
        parser = reqparse.RequestParser()
        parser.add_argument(name='email', type=str)
        parser.add_argument(name='code', type=str)
        parse = parser.parse_args()
        email = parse.get('email')
        code = parse.get('code')
        user = User.query.filter(User.email.__eq__(email)).first()
        admin = Admin.query.filter(Admin.email.__eq__(email)).first()
        if user:
            url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=自己的appid&secret=自己的secret&code={}&grant_type=authorization_code'.format(code)
            response = requests.get(url)
            logger.info('post[%s]=>[%d][%s]' % (
                code, response.status_code, response.text
            ))
            resData = response.json()
            access_token = resData['access_token']
            openid = resData['openid']

            url1 = 'https://api.weixin.qq.com/sns/userinfo?access_token={}&openid={}'.format(access_token,openid)
            response = requests.get(url1)
            logger.info('post[%s]=>[%s][%s][%s]' % (
                access_token,openid, response.status_code, response.text
            ))
            resData = response.json()
            headimgurl = resData['headimgurl']
            user.img_src = headimgurl
            db.session.commit()

            u = User.query.filter(User.openid.__eq__(openid)).first()
            if u:
                return jsonify({"err":"用户已绑定！"})
            else:
                user.jsapi_ticket = access_token
                user.openid = openid
                db.session.commit()
                data = {
                    'id':user.id,
                    'name':user.name,
                    'email':user.email,
                    'avatar':user.img_src,
                    'token':user.jsapi_ticket,
                    'openid':user.openid,
                    'type':user.type
                }
                return make_response((jsonify(data), 200, headers))
        elif admin:
            url2 = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=自己的appid&secret=自己的secret&code={}&grant_type=authorization_code'.format(code)
            response = requests.get(url2)
            logger.info('post[%s]=>[%d][%s]' % (
                code, response.status_code, response.text
            ))
            resData = response.json()
            access_token = resData['access_token']
            openid = resData['openid']

            url1 = 'https://api.weixin.qq.com/sns/userinfo?access_token={}&openid={}'.format(access_token, openid)
            response = requests.get(url1)
            logger.info('post[%s]=>[%s][%s][%s]' % (
                access_token, openid, response.status_code, response.text
            ))
            resData = response.json()
            headimgurl = resData['headimgurl']
            admin.avatar = headimgurl
            db.session.commit()
            a = Admin.query.filter(Admin.openid.__eq__(openid)).first()
            if a:
                return jsonify({"err": "用户已绑定！"})
            else:
                admin.token = access_token
                admin.openid = openid
                db.session.commit()
                data = {
                    'id': admin.id,
                    'name': admin.name,
                    'email': admin.email,
                    'avatar': admin.avatar,
                    'token': admin.token,
                    'openid': admin.openid,
                    'type':admin.type
                }
                return make_response((jsonify(data), 200, headers))
        else:
            return make_response((jsonify({'err': '用户信息不存在'}), 404, headers))

class TokenResource2(Resource):
    def get(self,code):
        pass
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
        }

        user = User.query.filter(User.openid.__eq__(code)).first()
        dealer = Dealer.query.filter(Dealer.openid.__eq__(code)).first()
        if user:
            data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'avatar': user.img_src,
                'token': user.jsapi_ticket,
                'openid': user.openid,
                'type': user.type
            }
            return make_response((jsonify(data), 200, headers))
        elif dealer:
            data = {
                'id': dealer.id,
                # 'name': admin.name,
                # 'email': admin.email,
                # 'avatar': admin.avatar,
                'token': dealer.token,
                # 'openid': admin.openid,
                # 'type': admin.type
            }
            return make_response((jsonify(data), 200, headers))
        else:
            return  make_response((jsonify({'err':'用户信息不存在'}),404,headers))


class TokenResource3(Resource):
    def get(self,code,pwd):
        url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=自己的appid&secret=自己的secret&code={}&grant_type=authorization_code'.format(
            code)
        response = requests.get(url)
        logger.info('post[%s]=>[%d][%s]' % (
            code, response.status_code, response.text
        ))

        resData = response.json()
        access_token = resData['access_token']
        openid = resData['openid']

        url1 = 'https://api.weixin.qq.com/sns/userinfo?access_token={}&openid={}'.format(access_token, openid)
        response = requests.get(url1)
        logger.info('post[%s]=>[%s][%s][%s]' % (
            access_token, openid, response.status_code, response.text
        ))
        resData = response.json()
        headimgurl = resData['headimgurl']
        user = User.query.filter(User.openid.__eq__(openid)).first()
        dealer = Dealer.query.filter(Dealer.openid==openid).first()
        if user:
            data = {
                'msg': '1',
                'user_info':{
                    'id':user.id,
                    'name':user.name,
                    'tel':user.tel,
                    'avatar':user.img_src,
                    'openid':user.openid,
                    'type':user.type
                }
            }
            return jsonify(data)
        elif dealer:
            admin = Admin.query.filter(Admin.id==dealer.admin_id).first()
            if admin and pwd == admin.pwd:
                data = {
                    'msg': '1',
                    'user_info': {
                        'id': admin.id,
                        'name': admin.name,
                        'password': admin.pwd,
                        'avatar': admin.avatar,
                        'openid': openid,
                        'type': admin.type
                    }
                }
                return jsonify(data)
            elif pwd != admin.pwd:
                data = {
                    'msg': '0',
                    'user_info': {
                        'openid': openid,
                        'avatar': headimgurl,
                    }
                }
                return jsonify(data)
            else:
                return jsonify({})
        else:
            data = {
                'msg': '0',
                'user_info': {
                    'openid': openid,
                    'avatar': headimgurl,
                }
            }
            return jsonify(data)