from ..app import app, db

class diagram(db.Model):
    __tablename__="Flores_Almagesti"
    img_name= db.Column(db.Text, primary_key=True)
    id = db.Column(db.String(6))
    City = db.Column(db.String(20))
    Cons_place = db.Column(db.String(100))
    date_max = db.Column(db.Integer)
    date_min = db.Column(db.Integer)
    Manuscript_name = db.Column(db.String(20))
    def __repr__(self):
        return '<diagram %r>' % (self.name)