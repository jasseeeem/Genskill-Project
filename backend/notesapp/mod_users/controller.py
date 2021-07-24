from flask import request, Blueprint, jsonify, current_app
from flask_jwt_extended import get_jwt, unset_jwt_cookies, create_access_token, get_jwt_identity, jwt_required, set_access_cookies
from notesapp import db, bcrypt
from datetime import datetime, timedelta, timezone

applet = Blueprint('users', __name__, url_prefix='/api/users')

@applet.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=2880))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response

@applet.route('/verify', methods = ['GET'])
@jwt_required()
def user_verify():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    if(user):
        return {'id': user.id, 'name': user.name, 'email': user.email, 'phone': user.phone, 'role': role.name}, 200
    return {'message': 'fail'}, 404

@applet.route('/<user_id>', methods = ['GET'])
@jwt_required()
def get_user_details(user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return {'message': 'Invalid user ID'}, 400
    user = User.query.filter_by(id=user_id).first()
    if(user):
        role = db.session.query(roles_users_table).join(Role).filter((roles_users_table.c.user_id==user.id) & (roles_users_table.c.role_id == Role.id)).all()
        role = Role.query.filter_by(id=role[0][1]).first()
        return {'id': user.id, 'name': user.name, 'email': user.email, 'phone': user.phone, 'role': role.name}, 200
    return {'message': 'fail'}, 404

@applet.route('/<user_id>', methods = ['PUT'])
@jwt_required()
def edit_user_details(user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return {'message': 'Invalid user ID'}, 400
    content = request.get_json(silent=True)
    user = User.query.filter_by(id=user_id).first()
    user_phone = User.query.filter_by(phone=content['phone']).first()
    if(user.phone == content['phone'] or user_phone == None):
        user.name = content['name']
        user.phone = content['phone']
        db.session.commit()
        db.session.remove()
        return {"message": "Changes saved"}, 200
    return {'message': 'Changes not saved'}, 409   

@applet.route('/<user_id>', methods = ['DELETE'])
@jwt_required()
def delete_user_details(user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return {'message': 'Invalid user ID'}, 400        
    user = User.query.filter_by(id=user_id).first()
    if not user:
        db.session.remove()
        return {'message': 'Rain gauge with the ID does not exist'}, 400
    db.session.delete(user)
    db.session.commit()
    return '', 204

@applet.route('/collectors', methods = ['GET'])
@jwt_required()
def collectors():
    try:
        role = [r[0] for r in db.session.query(roles_users_table).filter_by(role_id=2).all()]
        collectors = User.query.filter(User.id.in_(role)).all()
        response = jsonify([collector.to_dict() for collector in collectors])
        return response
    except:
        return {'message': 'server error'}, 500 

@applet.route('/admins', methods = ['GET'])
@jwt_required()
def admins():
    try:
        role = [r[0] for r in db.session.query(roles_users_table).filter_by(role_id=1).all()]
        admins = User.query.filter(User.id.in_(role)).all()
        response = jsonify([admin.to_dict() for admin in admins])
        return response
    except:
        return {'message': 'server error'}, 500

@applet.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "logout successful"})
    unset_jwt_cookies(response)
    return response

@applet.route('/signup', methods=['POST'])
def signup():
    content = request.get_json(silent=True)
    name = content['name']
    email = content['email']
    phone = content['phone']
    role = content['role']
    password = bcrypt.generate_password_hash(content['password']).decode('utf-8')
    if User.query.filter_by(email=email).first() or User.query.filter_by(phone=phone).first():
        db.session.remove()
        return {'message': 'User exists'}, 409
    role = db.session.query(Role).filter_by(name=role).first()
    user = User(name=name, email=email, phone=phone, password=password)
    user.roles.append(role)
    db.session.add(user)
    db.session.commit()
    role = db.session.query(roles_users_table).join(Role).filter((roles_users_table.c.user_id==user.id) & (roles_users_table.c.role_id == Role.id)).all()
    role = Role.query.filter_by(id=role[0][1]).first()
    db.session.remove()
    response = jsonify({'id': user.id, 'name': user.name, 'email': user.email, 'phone': user.phone, 'role': role.name})
    access_token = create_access_token(identity=email)
    set_access_cookies(response, access_token)
    return response

@applet.route('/login', methods=['POST'])
def login():
    content = request.get_json()
    email = content['email']
    password = content['password']
    if email:
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            role = db.session.query(roles_users_table).join(Role).filter((roles_users_table.c.user_id==user.id) & (roles_users_table.c.role_id == Role.id)).all()
            role = Role.query.filter_by(id=role[0][1]).first()
            db.session.remove()
            response = jsonify({'id': user.id, 'name': user.name, 'email': user.email, 'phone': user.phone, 'role': role.name})
            access_token = create_access_token(identity=email)
            set_access_cookies(response, access_token)
            return response
    return {'message': 'Invalid email or password'}, 401