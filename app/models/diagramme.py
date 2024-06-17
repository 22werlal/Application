from ..app import app, db

class diagram(db.Model):
    __tablename__="convert"
    img_name= db.Column(db.Text, primary_key=True)
    id = db.Column(db.String(6))
    City = db.Column(db.String(20))
    lat=db.Column(db.Float)
    long=db.Column(db.Float)
    Cons_place = db.Column(db.String(100))
    date_max = db.Column(db.Integer)
    date_min = db.Column(db.Integer)
    Manuscript_name = db.Column(db.String(20))
    def __repr__(self):
        return '<diagram %r>' % (self.name)
    def to_dict(self):
        return {
        'img_name': self.img_name,
        'date_min': self.date_min,
        'date_max': self.date_max,
        'city':self.City,
        'lat':self.lat,
        'long':self.long,
        'manuscript_name': self.Manuscript_name,
        'place': self.Cons_place,
        'wit': self.id,
        }

