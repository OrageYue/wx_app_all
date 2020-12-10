from flask import jsonify
from flask_restful import Resource, reqparse

from App.models import db, NewsClas, News

parser = reqparse.RequestParser()
parser.add_argument(name='name',type=str,required=True,help='新闻类名不能为空')


class NewsClsResource(Resource):
    def get(self):
        newscls = NewsClas.query.all()
        list_ = []
        if newscls:
            for new in newscls:
                data = {
                    'id': new.id,
                    'name': new.name
                }
                list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])

    def post(self):
        parse = parser.parse_args()
        name = parse.get('name')
        newscls = NewsClas()
        newscls.name = name
        try:
            db.session.add(newscls)
            db.session.commit()
        except Exception as e:
            print(str(e))
        newsclss = NewsClas.query.filter(NewsClas.name == name).order_by(NewsClas.id.desc()).first()
        data = {
            'id':newsclss.id,
            'name':name
        }
        return jsonify(data)

class NewsClsResource1(Resource):
    def put(self,id):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str)
        parse = parser.parse_args()
        name = parse.get('name')
        newscls = NewsClas.query.get(id)
        if newscls:
            newscls.name = name
            db.session.commit()
            data = {
                'id':id,
                'name':name
            }
            return jsonify(data)
        else:
            return jsonify({})

    def delete(self,id):
        newscls = NewsClas.query.get(id)
        if newscls:
            news = News.query.filter(News.cls_id==newscls.id).all()
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
