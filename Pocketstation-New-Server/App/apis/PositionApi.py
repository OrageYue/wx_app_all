from flask import jsonify
from flask_restful import Resource, reqparse
from sqlalchemy import or_

from App.models import Position, BusinessUnit, db, User, TrainingTask, GratitudeStar, LessonCollection, LessonComment, \
    Point, Testing, NewTest, ToolCollection, LessonThumb, Gratitude


class PositionResource(Resource):
    def get(self):
        poss = Position.query.all()
        list_ = []
        for pos in poss:
            bu_id = pos.bu_id
            bus = BusinessUnit.query.filter(BusinessUnit.id.__eq__(bu_id)).all()
            for bu in bus:
                data = {
                    'id':pos.id,
                    'name':pos.name,
                    'is_manager':pos.is_manager,
                    'bu':{
                        'id':bu.id,
                        'name':bu.name,
                    }
                }
                list_.append(data)
        return jsonify(list_)

class PositionResource1(Resource):
    def put(self,id):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str, required=True, help='名称不能为空')
        parser.add_argument(name='bu_id', type=int)
        parse = parser.parse_args()
        name = parse.get('name')
        bu_id = parse.get('bu_id')
        poss = Position.query.filter(Position.id.__eq__(id)).first()
        if poss:
            poss.name = name
            poss.bu_id = bu_id
            db.session.commit()
            bu = BusinessUnit.query.filter(BusinessUnit.id.__eq__(bu_id)).first()
            pos = Position.query.filter(Position.name == name).first()
            data = {
                'id': pos.id,
                'name': pos.name,
                'bu': {
                    'id': bu.id,
                    'name': bu.name,
                }
            }
            return jsonify(data)
        else:
            return jsonify({})

    def delete(self,id):
        poss = Position.query.filter(Position.id.__eq__(id)).first()
        if poss:
            users = User.query.filter(User.pos_id==poss.id).all()
            if users:
                for user in users:
                    tasks = TrainingTask.query.filter(TrainingTask.staff_id == user.id).all()
                    stars = GratitudeStar.query.filter(GratitudeStar.staff_id == user.id).all()
                    colls = LessonCollection.query.filter(LessonCollection.staff_id == user.id).all()
                    comments = LessonComment.query.filter(LessonComment.staff_id == user.id).all()
                    points = Point.query.filter(Point.staff_id == user.id).all()
                    tests = Testing.query.filter(Testing.staff_id == user.id).all()
                    newtests = NewTest.query.filter(NewTest.staff_id == user.id).all()
                    toolcolls = ToolCollection.query.filter(ToolCollection.staff_id == user.id).all()
                    thumbs = LessonThumb.query.filter(LessonThumb.staff_id == user.id).all()
                    grats = Gratitude.query.filter(or_(Gratitude.from_id == user.id, Gratitude.to_id == user.id)).all()

                    if tasks:
                        for task in tasks:
                            db.session.delete(task)
                    else:
                        pass
                    if stars:
                        for star in stars:
                            db.session.delete(star)
                    else:
                        pass
                    if colls:
                        for coll in colls:
                            db.session.delete(coll)
                    else:
                        pass
                    if comments:
                        for comment in comments:
                            db.session.delete(comment)
                    else:
                        pass
                    if points:
                        for point in points:
                            db.session.delete(point)
                    else:
                        pass
                    if tests:
                        for test in tests:
                            db.session.delete(test)
                    else:
                        pass
                    if newtests:
                        for newtest in newtests:
                            db.session.delete(newtest)
                    else:
                        pass
                    if toolcolls:
                        for toolcoll in toolcolls:
                            db.session.delete(toolcoll)
                    else:
                        pass
                    if thumbs:
                        for thumb in thumbs:
                            db.session.delete(thumb)
                    else:
                        pass
                    if grats:
                        for grat in grats:
                            db.session.delete(grat)
                    else:
                        pass
                    db.session.delete(user)
            else:
                pass
            db.session.delete(poss)
            db.session.commit()
            return jsonify({'msg':'删除成功！'})
        else:
            return jsonify({})

class PositionResource2(Resource):
    def post(self,bu_id):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str, required=True, help='名称不能为空')
        parser.add_argument(name='is_manager', type=int)
        parse = parser.parse_args()
        name = parse.get('name')
        is_manager = parse.get('is_manager')
        poss = Position()
        poss.name = name
        poss.is_manager = is_manager
        poss.bu_id = bu_id
        try:
            db.session.add(poss)
            db.session.commit()
        except Exception as e:
            print(str(e))
        bu = BusinessUnit.query.filter(BusinessUnit.id.__eq__(bu_id)).first()
        pos = Position.query.filter(Position.name == name).order_by(Position.id.desc()).first()
        data = {
            'id': pos.id,
            'name': pos.name,
            'is_manager': pos.is_manager,
            'bu': {
                'id': bu.id,
                'name': bu.name,
            }
        }
        return jsonify(data)