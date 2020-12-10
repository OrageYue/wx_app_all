from flask import jsonify
from flask_restful import Resource, reqparse

from App.models import LessonClas, db, Lesson, Operation, LessonPermission, \
    LessonComment, Testing, TrainingTask, LessonThumb, LessonCollection, Question

parser = reqparse.RequestParser()
parser.add_argument(name='name', type=str)
parser.add_argument(name='img_src', type=str)

class LessonClasResource(Resource):
    def get(self):
        les_clss = LessonClas.query.all()
        list_ = []
        for les_cls in les_clss:
            data = {
                'id':les_cls.id,
                'name':les_cls.name,
                'img_src':les_cls.img_src
            }
            list_.append(data)
        return jsonify(list_)

    def post(self):
        parse = parser.parse_args()
        name = parse.get('name')
        img_src = parse.get('img_src')
        les_cls = LessonClas()
        les_cls.name = name
        les_cls.img_src = img_src
        try:
            db.session.add(les_cls)
            db.session.commit()
        except Exception as e:
            print(str(e))
        les_clss = LessonClas.query.filter(LessonClas.name.__eq__(name)).first()
        data = {
            'id':les_clss.id,
            'name':name,
            'img_src':img_src
        }
        return jsonify(data)

class LessonClasResource1(Resource):
    def put(self,id):
        parse = parser.parse_args()
        name = parse.get('name')
        img_src = parse.get('img_src')
        les_clss = LessonClas.query.filter(LessonClas.id.__eq__(id)).first()
        if les_clss:
            les_clss.name = name
            les_clss.img_src = img_src
            db.session.commit()
            data = {
                'id':id,
                'name':name,
                'img_src':img_src
            }
            return jsonify(data)
        else:
            return jsonify({})

    def delete(self,id):
        les_clss = LessonClas.query.filter(LessonClas.id.__eq__(id)).first()
        if les_clss:
            opers = Operation.query.filter(Operation.cls_id==les_clss.id).all()
            if opers:
                for oper in opers:
                    lsns = Lesson.query.filter(Lesson.oper_id==oper.id).all()
                    if lsns:
                        for lesson in lsns:
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
                    else:
                        pass
                    db.session.delete(oper)

            db.session.delete(les_clss)
            db.session.commit()
            return jsonify({'msg':'删除成功！'})
        else:
            return jsonify({})
