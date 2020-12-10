from sqlalchemy import desc
from flask import jsonify
from flask_restful import Resource, reqparse

from App.models import db, dealerNew, dealerNewcls


#获取，添加
class News_(Resource):
    def get(self):
        news = dealerNew.query.order_by(desc('id')).all()
        list_ = []
        for new in news:
            class_id = new.cls_id
            cls_new = dealerNewcls.query.filter(dealerNewcls.id.__eq__(class_id)).first()
            data = {
                'id':new.id,
                'name':new.name,
                'content':new.content,
                'brief':new.brief,
                'create_at':new.create_at,
                'img_src':new.img_src,
                'cls':{
                    'name':cls_new.name,
                    'id':cls_new.id
                }
            }
            list_.append(data)
        return jsonify(list_)

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str)
        parser.add_argument(name='cls_id', type=int)
        parser.add_argument(name='img_src', type=str)
        parser.add_argument(name='brief', type=str)
        parser.add_argument(name='content', type=str)
        parse = parser.parse_args()
        name = parse.get('name')
        cls_id = parse.get('cls_id')
        img_src = parse.get('img_src')
        brief = parse.get('brief')
        content = parse.get('content')
        news = dealerNew()
        news.name = name
        news.cls_id = cls_id
        news.img_src = img_src
        news.brief = brief
        news.content = content
        try:
            db.session.add(news)
            db.session.commit()
        except Exception as e:
            print(str(e))
        new = dealerNew.query.filter(dealerNew.name == name).first()
        id = new.id
        cls_new = dealerNewcls.query.filter(dealerNewcls.id.__eq__(cls_id)).first()
        data = {
            'id':id,
            'name':name,
            'img_src':img_src,
            'brief':brief,
            'content':content,
            'cls':{
                'name': cls_new.name,
                'id': cls_new.id
            }
        }
        return jsonify(data)


#修改，删除
class getNews(Resource):
    def get(self,id):
        new = dealerNew.query.filter(dealerNew.id.__eq__(id)).first()
        cls_new = dealerNewcls.query.filter(dealerNewcls.id.__eq__(new.cls_id)).first()
        if new:
            data = {
                'id': new.id,
                'name': new.name,
                'content': new.content,
                'brief': new.brief,
                'create_at': new.create_at,
                'img_src': new.img_src,
                'cls': {
                    'name': cls_new.name,
                    'id': cls_new.id
                }
            }
            return jsonify(data)
        else:
            return jsonify({})

    def put(self,id):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str)
        parser.add_argument(name='cls_id', type=int)
        parser.add_argument(name='img_src', type=str)
        parser.add_argument(name='brief', type=str)
        parse = parser.parse_args()
        name = parse.get('name')
        cls_id = parse.get('cls_id')
        img_src = parse.get('img_src')
        brief = parse.get('brief')
        new = dealerNew.query.filter(dealerNew.id.__eq__(id)).first()
        if new:
            new.name = name
            new.img_src = img_src
            new.brief = brief
            new.cls_id = cls_id
            db.session.commit()
            cls_new = dealerNewcls.query.filter(dealerNewcls.id.__eq__(cls_id)).first()
            data = {
                'id':id,
                'name':name,
                'img_src':img_src,
                'brief':brief,
                'content':new.content,
                'cls': {
                    'name': cls_new.name,
                    'id': cls_new.id
                }
            }
            return jsonify(data)
        else:
            return jsonify({})

    def delete(self,id):
        new = dealerNew.query.filter(dealerNew.id.__eq__(id)).first()
        if new:
            db.session.delete(new)
            db.session.commit()
            return {'msg': '删除成功！'}
        else:
            return jsonify({})


#模糊查询
class SerachNews1(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str)
        parse = parser.parse_args()
        name = parse.get('name')
        news = dealerNew.query.filter(dealerNew.name.like('%'+name+'%')).all()
        if news:
            list_ = []
            for new in news:
                cls_new = dealerNewcls.query.filter(dealerNewcls.id.__eq__(new.cls_id)).first()
                data = {
                    'id': new.id,
                    'name': new.name,
                    'img_src': new.img_src,
                    'brief': new.brief,
                    'content': new.content,
                    'cls': {
                        'name': cls_new.name,
                        'id': cls_new.id
                    }
                }
                list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])


#按分类查看资讯
class SerachNews2(Resource):
    def get(self,cls_id):
        news = dealerNew.query.filter(dealerNew.cls_id.__eq__(cls_id)).all()
        new_clas = dealerNewcls.query.filter(dealerNewcls.id.__eq__(cls_id)).first()
        if news:
            list_ = []
            for new in news:
                cls_new = dealerNewcls.query.filter(dealerNewcls.id.__eq__(new.cls_id)).first()
                data = {
                    'id': new.id,
                    'class_name':new_clas.name,
                    'name': new.name,
                    'img_src': new.img_src,
                    'brief': new.brief,
                    'content': new.content,
                    'cls': {
                        'name': cls_new.name,
                        'id': cls_new.id
                    }
                }
                list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])


class getNews_2(Resource):
    def get(self,id):
        list_ = []
        news = dealerNew.query.filter(dealerNew.cls_id==id).order_by(dealerNew.id.desc()).all()
        if news:
            for new in news:
                cls_new = dealerNewcls.query.filter(dealerNewcls.id.__eq__(new.cls_id)).first()
                data = {
                    'id': new.id,
                    'name': new.name,
                    'img_src': new.img_src,
                    'brief': new.brief,
                    'content': new.content,
                    'cls': {
                        'name': cls_new.name,
                        'id': cls_new.id
                    }
                }
                list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])