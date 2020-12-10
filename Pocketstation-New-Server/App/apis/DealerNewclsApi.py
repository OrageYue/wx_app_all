from flask import jsonify
from flask_restful import Resource, reqparse

from App.models import db, NewsClas, dealerNewcls, dealerNew

parser = reqparse.RequestParser()
parser.add_argument(name='name',type=str)
parser.add_argument(name='img_src',type=str)


class getNewcls(Resource):
    def get(self):
        newscls = dealerNewcls.query.all()
        list_ = []
        if newscls:
            for new in newscls:
                data = {
                    'id': new.id,
                    'name': new.name,
                    'img_src': new.img_src
                }
                list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])

    def post(self):
        parse = parser.parse_args()
        name = parse.get('name')
        img_src = parse.get('img_src')
        newscls = dealerNewcls()
        newscls.name = name
        newscls.img_src = img_src
        db.session.add(newscls)
        db.session.commit()
        newsclss = dealerNewcls.query.filter(dealerNewcls.name == name).order_by(dealerNewcls.id.desc()).first()
        data = {
            'id':newsclss.id,
            'name':name,
            'img_src':img_src
        }
        return jsonify(data)


class putNewcls(Resource):
    def put(self,id):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str)
        parser.add_argument(name='img_src', type=str)
        parse = parser.parse_args()
        name = parse.get('name')
        img_src = parse.get('img_src')
        newscls = dealerNewcls.query.filter(dealerNewcls.id==id).first()
        if newscls:
            newscls.name = name
            newscls.img_src = img_src
            db.session.commit()
            data = {
                'id':id,
                'name':name,
                'img_src':img_src,
            }
            return jsonify(data)
        else:
            return jsonify({})

    def delete(self,id):
        newscls = dealerNewcls.query.filter(dealerNewcls.id==id).first()
        if newscls:
            news = dealerNew.query.filter(dealerNew.cls_id==newscls.id).all()
            if news:
                for new in news:
                    db.session.delete(new)
            else:
                pass
            db.session.delete(newscls)
            db.session.commit()
            return jsonify({'msg':'删除成功！'})
        else:
            return jsonify({})
