import datetime
from sqlalchemy import extract, and_

from flask import jsonify
from flask_restful import Resource, reqparse

from App.models import Tool, ToolCollection, LessonClas, db, User


class ToolsResource(Resource):
    def get(self,tool_id):
        staffs = []
        tools = Tool.query.filter(Tool.id.__eq__(tool_id)).first()
        if tools:
            lsn_cls = LessonClas.query.filter(LessonClas.id.__eq__(tools.lsncls_id)).first()
            tool_colls = ToolCollection.query.filter(ToolCollection.tool_id.__eq__(tool_id)).all()
            for tool_coll in tool_colls:
                staffs.append(tool_coll.staff_id)
            data = {
                'id':tools.id,
                'content':tools.content,
                'type':tools.type,
                'name':tools.name,
                'staffs':staffs,
                'cls':{
                    'name':lsn_cls.name,
                    'id':lsn_cls.id
                }
            }
            return jsonify(data)
        else:
            return jsonify({})

    def patch(self,tool_id):
        parser = reqparse.RequestParser()
        parser.add_argument(name='tool_name', type=str)
        parse = parser.parse_args()
        name = parse.get('tool_name')
        tool = Tool.query.filter(Tool.id.__eq__(tool_id)).first()
        tool.name = name
        db.session.commit()
        lsn_cls = LessonClas.query.filter(LessonClas.id.__eq__(tool.lsncls_id)).first()
        data = {
            'id': tool.id,
            'name': tool.name,
            'type': tool.type,
            'content': tool.content,
            'cls': {
                'id': lsn_cls.id,
                'name': lsn_cls.name
            }
        }
        return jsonify(data)

    def delete(self,tool_id):
        tool = Tool.query.filter(Tool.id.__eq__(tool_id)).first()
        if tool:
            toolColls = ToolCollection.query.filter(ToolCollection.tool_id==tool.id).all()
            if toolColls:
                for toolcoll in toolColls:
                    db.session.delete(toolcoll)
            else:
                pass
            db.session.delete(tool)
            db.session.commit()
            return jsonify({'msg':'删除成功！'})
        else:
            return jsonify({})


class ToolsResource1(Resource):
    def get(self):
        tools = Tool.query.all()
        list_ = []
        for tool in tools:
            lsn_cls = LessonClas.query.filter(LessonClas.id.__eq__(tool.lsncls_id)).first()
            data = {
                'id':tool.id,
                'name':tool.name,
                'type':tool.type,
                'content':tool.content,
                'cls':{
                    'id':lsn_cls.id,
                    'name':lsn_cls.name
                }
            }
            list_.append(data)
        return jsonify(list_)

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str)
        parser.add_argument(name='content', type=str)
        parser.add_argument(name='lsncls_id', type=int)
        parser.add_argument(name='type', type=str)
        parse = parser.parse_args()
        name = parse.get('name')
        content = parse.get('content')
        lsncls_id = parse.get('lsncls_id')
        type = parse.get('type')

        tool = Tool()
        tool.name = name
        tool.content = content
        tool.lsncls_id = lsncls_id
        tool.type = type
        db.session.add(tool)
        db.session.commit()
        tools = Tool.query.filter(Tool.name.__eq__(name)).first()
        lsn_cls = LessonClas.query.filter(LessonClas.id.__eq__(tools.lsncls_id)).first()
        data = {
            'id': tool.id,
            'name': tool.name,
            'type': tool.type,
            'content': tool.content,
            'cls': {
                'id': lsn_cls.id,
                'name': lsn_cls.name
            }
        }
        return jsonify(data)


class Tools1(Resource):
    def get(self,tool_id,staff_id):
        year_ = datetime.datetime.now().year
        month_ = datetime.datetime.now().month
        day_ = datetime.datetime.now().day
        user_ = User.query.filter(User.id == staff_id, and_(
            extract('year', User.update_time) == year_,
            extract('month', User.update_time) == month_,
            extract('day', User.update_time) == day_
        )).first()
        user = User.query.filter(User.id==staff_id).first()
        if user:
            if user.toolnumber:
                str1 = user.toolnumber + '#' + tool_id
                str2 = str1.split('#')
                str3 = list(set(str2))
                user.toolnumber = "#".join(str3)
                user.toolnumber_day = "#".join(str3)
                db.session.commit()
                if user_:
                    pass
                else:
                    u = User.query.filter(User.id == staff_id).first()
                    u.toolnumber_day = tool_id
                    db.session.commit()

                return jsonify({'msg':'成功！'})
            else:
                user.toolnumber = tool_id
                user.toolnumber_day = tool_id
                db.session.commit()
                return jsonify({'msg': '成功！'})

        else:
            return jsonify({})


class Tools2(Resource):
    def get(self,cls_id):
        list_ = []
        tools = Tool.query.filter(Tool.lsncls_id==cls_id).all()
        if tools:
            for tool in tools:
                data = {
                    'id': tool.id,
                    'name': tool.name,
                    'type': tool.type,
                    'content': tool.content,
                }
                list_.append(data)
            return jsonify(list_)
        else:
            return jsonify([])

