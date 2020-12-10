from flask import jsonify
from flask_restful import Resource, reqparse
from sqlalchemy import or_

from App.models import BusinessUnit, db, Position, Admin, LessonPermission, User, HD, Hd_Ans, TrainingTask, \
    GratitudeStar, LessonCollection, LessonComment, Point, Testing, NewTest, ToolCollection, LessonThumb, Gratitude, \
    Dealer

parser = reqparse.RequestParser()
parser.add_argument(name='name', type=str, required=True, help='名称不能为空')

class BuResource(Resource):
    def get(self):
        bus = BusinessUnit.query.all()
        list_ = []
        for bu in bus:
            data = {
                'id':bu.id,
                'name':bu.name
            }
            list_.append(data)
        return jsonify(list_)

    def post(self):
        parse = parser.parse_args()
        name = parse.get('name')
        bu = BusinessUnit()
        bu.name = name
        db.session.add(bu)
        db.session.commit()
        bus = BusinessUnit.query.filter(BusinessUnit.name == name).order_by(BusinessUnit.id.desc()).first()
        data = {
            'id': bus.id,
            'name': name
        }
        return jsonify(data)

class BuResource1(Resource):
    def put(self,id):
        parse = parser.parse_args()
        name = parse.get('name')
        bu = BusinessUnit.query.filter(BusinessUnit.id.__eq__(id)).first()
        if bu:
            bu.name = name
            db.session.commit()
            data = {
                'id': id,
                'name': name
            }
            return jsonify(data)
        else:
            return jsonify({})

    def delete(self,id):
        bu = BusinessUnit.query.filter(BusinessUnit.id.__eq__(id)).first()
        if bu:
            poss = Position.query.filter(Position.bu_id==bu.id).all()
            admins = Admin.query.all()
            perss = LessonPermission.query.filter(LessonPermission.bu_id==bu.id).all()
            if poss:
                for pos in poss:
                    users = User.query.filter(User.pos_id == pos.id).all()
                    if users:
                        for user in users:
                            tasks = TrainingTask.query.filter(TrainingTask.staff_id==user.id).all()
                            stars = GratitudeStar.query.filter(GratitudeStar.staff_id==user.id).all()
                            colls = LessonCollection.query.filter(LessonCollection.staff_id==user.id).all()
                            comments = LessonComment.query.filter(LessonComment.staff_id==user.id).all()
                            points = Point.query.filter(Point.staff_id==user.id).all()
                            tests = Testing.query.filter(Testing.staff_id==user.id).all()
                            newtests = NewTest.query.filter(NewTest.staff_id==user.id).all()
                            toolcolls = ToolCollection.query.filter(ToolCollection.staff_id==user.id).all()
                            thumbs = LessonThumb.query.filter(LessonThumb.staff_id==user.id).all()
                            grats = Gratitude.query.filter(or_(Gratitude.from_id==user.id,Gratitude.to_id==user.id)).all()
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
                    db.session.delete(pos)
            else:
                pass
            if perss:
                for pers in perss:
                    db.session.delete(pers)
            else:
                pass
            for admin in admins:
                buids = eval(admin.bu_id)
                for buid in buids:
                    if int(buid) == int(id):
                        buinfo = eval(admin.bu_id)
                        buinfo.remove(int(id))
                        admin.bu_id = str(buinfo)
                        db.session.commit()
                        if len(eval(admin.bu_id)) == 0:
                            hds = HD.query.filter(HD.admin_id == admin.id).all()
                            dealers = Dealer.query.filter(Dealer.admin_id == admin.id).all()
                            if hds:
                                for hd in hds:
                                    hd_ans = Hd_Ans.query.filter(or_(Hd_Ans.admin_id == admin.id,Hd_Ans.hd_id==hd.id)).all()
                                    if hd_ans:
                                        for hd_an in hd_ans:
                                            db.session.delete(hd_an)
                                    else:
                                        pass
                                    db.session.delete(hd)
                            else:
                                pass
                            if dealers:
                                for dealer in dealers:
                                    db.session.delete(dealer)
                            else:
                                pass
                            db.session.delete(admin)
                    else:
                        pass
            db.session.delete(bu)
            db.session.commit()
            return jsonify({'msg':'删除成功！'})
        else:
            return jsonify({})