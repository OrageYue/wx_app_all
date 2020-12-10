# -*- coding: utf-8 -*-
from flask import jsonify
from flask_restful import Resource, reqparse

from App.models import db, dealerNew


class dealerBanner(Resource):
    def get(self):
        news = dealerNew.query.filter(dealerNew.is_banner.__eq__(1)).all()
        list_ = []
        if news:
            for new in news:
                data = {
                    'content':new.content,
                    'img_src':new.img_src,
                    'name':new.name,
                    'brief':new.brief,
                    'id':new.id,
                    'create_at':new.create_at
                }
                list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(name='news', type=str)
        parse = parser.parse_args()
        news = parse.get('news')
        news = eval(news)
        new1 = dealerNew.query.filter(dealerNew.id==news['old_id']).first()
        new2 = dealerNew.query.filter(dealerNew.id==news['new_id']).first()
        if new1 and new2:
            new1.is_banner = 0
            new2.is_banner = 1
            db.session.commit()
        else:
            pass
        return jsonify({'msg': '设置成功！'})
