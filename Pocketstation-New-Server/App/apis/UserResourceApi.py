import datetime

from flask import jsonify
from flask_restful import Resource, reqparse
from App.models import LessonClas, Operation, Lesson, Tool, LessonPermission, User, Position, \
    BusinessUnit, UserResource, db
from sqlalchemy import extract, and_

parser = reqparse.RequestParser()
parser.add_argument(name='name',type=str,required=True,help='名称不能为空')
parser.add_argument(name='content',type=str,required=True,help='内容不能为空')
parser.add_argument(name='type',type=str,required=True,help='类型不能为空')
parser.add_argument(name='hier',type=int)

class UserResource2(Resource):
    def get(self,user_id,hier,resId):
        if hier == str(1):
            list_ = []
            lsn_clss = LessonClas.query.all()
            for lsn_cls in lsn_clss:
                data = {
                    'id':lsn_cls.id,
                    'name':lsn_cls.name,
                    'type':'folder',
                    'p_id':2
                }
                list_.append(data)
            return jsonify(list_)
        elif hier == str(2):
            list_1 = []
            opers = Operation.query.filter(Operation.cls_id.__eq__(resId)).all()
            for oper in opers:
                data = {
                    'id': oper.id,
                    'name': oper.name,
                    'type': 'folder',
                    'p_id': 3
                }
                list_1.append(data)
            return jsonify(list_1)
        elif hier == str(3):
            list_2 = []
            user = User.query.filter(User.id.__eq__(user_id)).first()
            pos = Position.query.filter(Position.id.__eq__(user.pos_id)).first()
            bu = BusinessUnit.query.filter(BusinessUnit.id.__eq__(pos.bu_id)).first()
            les_permissions = LessonPermission.query.filter(LessonPermission.bu_id.__eq__(bu.id)).all()
            if les_permissions:
                for les_permission in les_permissions:
                    lesson = Lesson.query.filter(Lesson.oper_id.__eq__(resId),Lesson.id.__eq__(les_permission.lsn_id)).first()
                    if lesson:
                        data = {
                            'id': lesson.id,
                            'name': lesson.name,
                            'type': 'folder',
                            'p_id': 4
                        }
                        list_2.append(data)
                return jsonify(list_2)
            return jsonify([])
        elif hier == str(4):
            list_3 = []
            tools = Tool.query.filter(Tool.lsn_id.__eq__(resId)).all()
            for tool in tools:
                data = {
                    'id': tool.id,
                    'name': tool.name,
                    'type': tool.type,
                    'content': tool.content,
                }
                list_3.append(data)
            return jsonify(list_3)
        else:
            return jsonify([])


class UserResource_(Resource):
    def get(self,id):
        res = UserResource.query.filter(UserResource.id==id).all()
        list_ = []
        for re in res:
            data = {
                'id':re.id,
                'name':re.name,
                'type':re.type,
                'content':re.content
            }
            list_.append(data)
        return jsonify(list_)


class UserResourceApi1(Resource):
    def get(self,resId):
        res = UserResource.query.filter(UserResource.p_id==resId).all()
        list_ = []
        for re in res:
            data = {
                'id':re.id,
                'name':re.name,
                'type':re.type,
                'content':re.content
            }
            list_.append(data)
        return jsonify(list_)

    def delete(self,resId):
        res = UserResource.query.filter(UserResource.id.__eq__(resId)).first()
        if res:
            db.session.delete(res)
            db.session.commit()
            return jsonify({'msg':'删除成功！'})
        else:
            return jsonify({})

    def put(self,resId):
        parse = parser.parse_args()
        name = parse.get('name')
        content = parse.get('content')
        type = parse.get('type')
        hier = parse.get('hier')
        res = UserResource.query.filter(UserResource.id.__eq__(resId)).first()
        if res:
            res.name = name
            res.content = content
            res.type = type
            res.p_id = hier
            db.session.commit()
            re = UserResource.query.filter(UserResource.id.__eq__(hier)).first()
            data = {
                'id': resId,
                'name': name,
                'content': content,
                'type': type,
                'hier': {
                    'id':re.p_id,
                    'name':re.name
                }
            }
            return jsonify(data)
        else:
            return jsonify({})



class UserResourceApi2(Resource):
    def get(self):
        res = UserResource.query.all()
        list_ = []
        for re in res:
            if re.type != 'folder':
                rs = UserResource.query.filter(UserResource.id == re.p_id).all()
                for r in rs:
                    data = {
                        'id': re.id,
                        'name': re.name,
                        'content': re.content,
                        'type': re.type,
                        'hier': {
                            'name': r.name,
                            'id': r.id
                        }
                    }
                    list_.append(data)
        return jsonify(list_)

    def post(self):
        parse = parser.parse_args()
        name = parse.get('name')
        content = parse.get('content')
        type_ = parse.get('type')
        hier_ = parse.get('hier')
        re = UserResource()
        re.name = name
        re.type = type_
        re.content = content
        re.p_id = hier_
        db.session.add(re)
        db.session.commit()
        if type == 'folder':
            pass
        else:
            res = UserResource.query.filter(UserResource.name==name).first()
            id = res.id
            data = {
                'id':id,
                'name':name,
                'content':content,
                'type':type_,
                'hier':hier_
            }
            return jsonify(data)

class UserResourceApi3(Resource):
    def get(self):
        res1 = UserResource.query.filter(UserResource.type=="folder").all()
        list_ = []
        for re1 in res1:
            data = {
                'id': re1.id,
                'name': re1.name,
                }
            list_.append(data)
        return jsonify(list_)

class UserResourceApi4(Resource):
    def get(self):
        res = UserResource.query.all()
        list_ = []
        for re in res:
            if re.type == 'folder':
                rs = UserResource.query.filter(UserResource.id == re.p_id).all()
                for r in rs:
                    data = {
                        'id': re.id,
                        'name': re.name,
                        'content': re.content,
                        'type': re.type,
                        'hier': {
                            'name': r.name,
                            'id': r.id
                        }
                    }
                    list_.append(data)
        return jsonify(list_)

class UserResourceApi5(Resource):
    def put(self,resId):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str, required=True, help='名称不能为空')
        parser.add_argument(name='p_id', type=int)
        parse = parser.parse_args()
        name = parse.get('name')
        p_id = parse.get('p_id')
        res = UserResource.query.filter(UserResource.id.__eq__(resId)).first()
        if res:
            res.name = name
            res.p_id = p_id
            db.session.commit()
            return jsonify({'msg':'修改成功！'})
        else:
            return jsonify({'msg':'暂无信息！'})

    def delete(self,resId):
        res = UserResource.query.filter(UserResource.id.__eq__(resId)).first()
        if res:
            ress = UserResource.query.filter(UserResource.p_id==res.id).all()
            if ress:
                for re in ress:
                    db.session.delete(re)
            db.session.delete(res)
            db.session.commit()
            return jsonify({'msg':'删除成功！'})
        else:
            return jsonify({'msg':'暂无信息！'})

class UserResource1(Resource):
    def get(self,res_id,user_id):
        year_ = datetime.datetime.now().year
        month_ = datetime.datetime.now().month
        day_ = datetime.datetime.now().day
        user_ = User.query.filter(User.id == user_id, and_(
            extract('year', User.update_time) == year_,
            extract('month', User.update_time) == month_,
            extract('day', User.update_time) == day_
        )).first()
        user = User.query.filter(User.id==user_id).first()
        if user:
            if user.resnumber:
                str1 = user.resnumber + '#' + res_id
                str2 = str1.split('#')
                str3 = list(set(str2))
                user.resnumber = "#".join(str3)
                user.resnumber_day = "#".join(str3)
                db.session.commit()
                if user_:
                    pass
                else:
                    u = User.query.filter(User.id == user_id).first()
                    u.resnumber_day = res_id
                    db.session.commit()

                return jsonify({'msg': '成功！'})
            else:
                user.resnumber = res_id
                user.resnumber_day = res_id
                db.session.commit()
                return jsonify({'msg': '成功！'})
        else:
            return jsonify({})


class resSearch(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str)
        parse = parser.parse_args()
        name = parse.get('name')
        list_ = []
        ress = UserResource.query.filter(UserResource.name.__eq__(name)).all()
        if ress:
            for re in ress:
                rs = UserResource.query.filter(UserResource.id == re.p_id).all()
                for r in rs:
                    data = {
                        'id': re.id,
                        'name': re.name,
                        'content': re.content,
                        'type': re.type,
                        'hier': {
                            'name': r.name,
                            'id': r.id
                        }
                    }
                    list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])


class resSearch_2(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str)
        parse = parser.parse_args()
        name = parse.get('name')
        list_ = []
        ress = UserResource.query.filter(UserResource.name.like('%'+name+'%')).all()
        if ress:
            for re in ress:
                rs = UserResource.query.filter(UserResource.id == re.p_id).all()
                for r in rs:
                    data = {
                        'id': re.id,
                        'name': re.name,
                        'content': re.content,
                        'type': re.type,
                        'hier': {
                            'name': r.name,
                            'id': r.id
                        }
                    }
                    list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])