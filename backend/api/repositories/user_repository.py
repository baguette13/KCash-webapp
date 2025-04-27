class UserRepository:
    @staticmethod
    def update_user(user, data):
        try:
            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.save()
            return user
        except Exception as e:
            return {"error": str(e)}