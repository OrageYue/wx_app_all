# -*- coding: utf-8 -*-
from flask import jsonify
from flask_restful import Resource
import datetime

from sqlalchemy import extract, and_

from App.models import User

year_ = datetime.datetime.now().year
month_ = datetime.datetime.now().month
day_ = datetime.datetime.now().day


class searchBirthday(Resource):
    def get(self):
        list_ = []
        users = User.query.filter(and_(
            extract('year', User.birthday) == year_,
            extract('month', User.birthday) == month_,
            extract('day', User.birthday) == day_,
        )).all()

        if users:
            for user in users:
                data = {
                    'id':user.id,
                    'name':user.name,
                    'birthday':user.birthday,
                }
                list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])
