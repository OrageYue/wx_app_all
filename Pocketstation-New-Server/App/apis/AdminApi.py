from flask import jsonify
from flask_restful import Resource, reqparse
from App.models import Admin, db, BusinessUnit, HD, Hd_Ans, Dealer

parser = reqparse.RequestParser()
parser.add_argument(name='name', type=str)
parser.add_argument(name='email', type=str)
parser.add_argument(name='mail', type=str)
parser.add_argument(name='bu_id', type=str)
parser.add_argument(name='pwd', type=str)


class AdminApiResource(Resource):
    def get(self):
        admins = Admin.query.all()
        list_ = []
        for admin in admins:
            buIds = eval(admin.bu_id)
            for buid in buIds:
                bu = BusinessUnit.query.filter(BusinessUnit.id == buid).first()
                if bu:
                    data = {
                        'admin_id': admin.id,
                        'pwd': admin.pwd,
                        'name': admin.name,
                        'mail': admin.mail,
                        'email': admin.email,
                        'avatar': admin.avatar,
                        'create_at': admin.create_at,
                        'bu': {
                            'name': bu.name,
                            'id': bu.id
                        }
                    }
                    list_.append(data)
        list2 = []
        for i in range(len(list_)):
            if list_[i] != {}:
                re_list = []
                re_list.append(list_[i].get('bu'))
                for j in range(i + 1, len(list_)):
                    if list_[i].get('admin_id') == list_[j].get('admin_id'):
                        re_list.append(list_[j].get('bu'))
                        list_[i]['bu'] = re_list
                        list_[j] = {}
                if type(list_[i]['bu']) == list:
                    pass
                else:
                    list_[i]['bu'] = [list_[i]['bu']]
                list2.append(list_[i])
        return jsonify(list2)

    def post(self):
        parse = parser.parse_args()
        name = parse.get('name')
        email = parse.get('email')
        mail = parse.get('mail')
        bu_id = parse.get('bu_id')
        pwd = parse.get('pwd')
        avatar = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544011472569&di=0c979013036cc5d17214a99ea8db9d9f&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F00%2F67%2F59%2F63%2F58e89bee922a2.png'
        admin = Admin()
        admin.name = name
        admin.email = email
        admin.mail = mail
        admin.bu_id = bu_id
        admin.pwd = pwd
        admin.avatar = avatar
        try:
            db.session.add(admin)
            db.session.commit()
        except Exception as e:
            print(str(e))
        return jsonify({'msg':'添加成功'})


class AdminApiResource1(Resource):
    def put(self,admin_id):
        parse = parser.parse_args()
        name = parse.get('name')
        email = parse.get('email')
        mail = parse.get('mail')
        bu_id = parse.get('bu_id')
        avatar = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544011472569&di=0c979013036cc5d17214a99ea8db9d9f&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F00%2F67%2F59%2F63%2F58e89bee922a2.png'

        admin = Admin.query.filter(Admin.id.__eq__(admin_id)).first()
        if admin:
            admin.name = name
            admin.email = email
            admin.mail = mail
            admin.avatar = avatar
            admin.bu_id = bu_id
            db.session.commit()
            return jsonify({'msg':'修改成功'})
        else:
            return jsonify({})

    def delete(self,admin_id):
        admin = Admin.query.filter(Admin.id.__eq__(admin_id)).first()
        if admin:
            hds = HD.query.filter(HD.admin_id==admin.id).all()
            dealers = Dealer.query.filter(Dealer.admin_id==admin.id).all()
            if hds:
                for hd in hds:
                    db.session.delete(hd)
            else:
                pass
            Hd_ans = Hd_Ans.query.filter(Hd_Ans.admin_id==admin.id).all()
            if Hd_ans:
                for hd_an in Hd_ans:
                    db.session.delete(hd_an)
            else:
                pass
            if dealers:
                for dealer in dealers:
                    db.session.delete(dealer)
            else:
                pass
            db.session.delete(admin)
            db.session.commit()
            return jsonify({'msg': '删除成功！'})
        else:
            return jsonify({})


class adminSearch(Resource):
    def post(self):
        list_ = []
        parser = reqparse.RequestParser()
        parser.add_argument(name='name', type=str)
        parse = parser.parse_args()
        name = parse.get('name')
        admin = Admin.query.filter(Admin.name.__eq__(name)).first()
        buIds = eval(admin.bu_id)
        for buid in buIds:
            bu = BusinessUnit.query.filter(BusinessUnit.id == buid).first()
            if bu:
                data = {
                    'admin_id': admin.id,
                    'pwd': admin.pwd,
                    'name': admin.name,
                    'mail': admin.mail,
                    'email': admin.email,
                    'avatar': admin.avatar,
                    'create_at': admin.create_at,
                    'bu': {
                        'name': bu.name,
                        'id': bu.id
                    }
                }
                list_.append(data)
        list2 = []
        for i in range(len(list_)):
            if list_[i] != {}:
                re_list = []
                re_list.append(list_[i].get('bu'))
                for j in range(i + 1, len(list_)):
                    if list_[i].get('admin_id') == list_[j].get('admin_id'):
                        re_list.append(list_[j].get('bu'))
                        list_[i]['bu'] = re_list
                        list_[j] = {}
                if type(list_[i]['bu']) == list:
                    pass
                else:
                    list_[i]['bu'] = [list_[i]['bu']]
                list2.append(list_[i])
        return jsonify(list2)