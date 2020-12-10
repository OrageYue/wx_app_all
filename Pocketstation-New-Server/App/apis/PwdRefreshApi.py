# -*- coding: utf-8 -*-
from flask import jsonify
from flask_restful import Resource
import random

from App.models import Admin, db


class PwdRef(Resource):
    def get(self):
        admins = Admin.query.all()
        if admins:
            for admin in admins:
                str = ""
                for i in range(6):
                    ch = chr(random.randrange(ord('0'), ord('9') + 1))
                    str += ch
                    admin.pwd = str
                    db.session.commit()
            return jsonify({'msg':'成功'})
        else:
            return jsonify({})
