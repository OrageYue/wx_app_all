from flask import jsonify
from flask_restful import Resource, reqparse

from App.models import Operation, LessonClas, db, Lesson, LessonPermission, LessonCollection, LessonComment, Testing, \
    TrainingTask, Question, LessonThumb

parser = reqparse.RequestParser()
parser.add_argument(name='name', type=str, required=True, help='类名不能为空')
parser.add_argument(name='cls_id', type=int)
parser.add_argument(name='img_src', type=str)

class OperationResource(Resource):
    def get(self):
        opers = Operation.query.all()
        list_ = []
        for oper in opers:
            les_cls = LessonClas.query.filter(LessonClas.id==oper.cls_id).first()
            data = {
                'id':oper.id,
                'name':oper.name,
                'img_src':oper.img_src,
                'cls':{
                    'id':les_cls.id,
                    'name':les_cls.name
                }
            }
            list_.append(data)
        return jsonify(list_)

    def post(self):
        parse = parser.parse_args()
        name = parse.get('name')
        cls_id = parse.get('cls_id')
        img_src = parse.get('img_src')
        opers = Operation()
        opers.name = name
        opers.cls_id = cls_id
        opers.img_src = img_src
        try:
            db.session.add(opers)
            db.session.commit()
        except Exception as e:
            print(str(e))
        les_cls = LessonClas.query.filter(LessonClas.id == cls_id).first()
        operss = Operation.query.filter(Operation.name.__eq__(name)).first()
        data = {
            'id': operss.id,
            'name': name,
            'img_src': img_src,
            'cls': {
                'id': les_cls.id,
                'name': les_cls.name
            }
        }
        return jsonify(data)

class OperationResource1(Resource):
    def put(self,id):
        parse = parser.parse_args()
        name = parse.get('name')
        img_src = parse.get('img_src')
        opers = Operation.query.filter(Operation.id.__eq__(id)).first()
        if opers:
            opers.name = name
            opers.img_src = img_src
            db.session.commit()
            operss = Operation.query.filter(Operation.name.__eq__(name)).first()
            les_cls = LessonClas.query.filter(LessonClas.id == operss.cls_id).first()
            data = {
                'id': operss.id,
                'name': name,
                'img_src': img_src,
                'cls': {
                    'id': les_cls.id,
                    'name': les_cls.name
                }
            }
            return jsonify(data)
        else:
            return jsonify({})

    def delete(self,id):
        opers = Operation.query.filter(Operation.id.__eq__(id)).first()
        if opers:
            lessons = Lesson.query.filter(Lesson.oper_id==opers.id).all()
            if lessons:
                for lesson in lessons:
                    perms = LessonPermission.query.filter(LessonPermission.lsn_id == lesson.id).all()
                    lsnCollection = LessonCollection.query.filter(LessonCollection.lesson_id == lesson.id).all()
                    lsnComment = LessonComment.query.filter(LessonComment.lsn_id == lesson.id).all()
                    tests = Testing.query.filter(Testing.lsn_id == lesson.id).all()
                    tasks = TrainingTask.query.filter(TrainingTask.lsn_id == lesson.id).all()
                    questions = Question.query.filter(Question.lsn_id == lesson.id).all()
                    thumbs = LessonThumb.query.filter(LessonThumb.lsn_id == lesson.id).all()
                    if perms:
                        for perm in perms:
                            db.session.delete(perm)
                    else:
                        pass
                    if lsnCollection:
                        for lsnColl in lsnCollection:
                            db.session.delete(lsnColl)
                    else:
                        pass
                    if lsnComment:
                        for lsnCom in lsnComment:
                            db.session.delete(lsnCom)
                    else:
                        pass
                    if tests:
                        for test in tests:
                            db.session.delete(test)
                    else:
                        pass
                    if tasks:
                        for task in tasks:
                            db.session.delete(task)
                    else:
                        pass
                    if questions:
                        for question in questions:
                            db.session.delete(question)
                    else:
                        pass
                    if thumbs:
                        for thumb in thumbs:
                            db.session.delete(thumb)
                    else:
                        pass
                    db.session.delete(lesson)

            db.session.delete(opers)
            db.session.commit()
            return jsonify({'msg':'删除成功！'})
        else:
            return jsonify({'err': '暂无信息！'})

#前端页面
class OperationResource2(Resource):
    def get(self,cls_id):
        opers = Operation.query.filter(Operation.cls_id.__eq__(cls_id)).all()
        list_ = []
        if opers:
            for oper in opers:
                les_cls = LessonClas.query.filter(LessonClas.id.__eq__(oper.cls_id)).first()
                data = {
                    'cls':{
                        'id':les_cls.id,
                        'name':les_cls.name
                    },
                    'id':oper.id,
                    'name':oper.name,
                    'img_src':oper.img_src
                }
                list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])
