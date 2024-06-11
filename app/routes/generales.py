from ..app import app, db
from flask import render_template,request
from sqlalchemy import text,or_
from ..models.diagramme import diagram
from ..config import Config

@app.route("/")
@app.route("/home")
def accueil():
    return render_template("pages/acceuil.html",sous_titre="!")

#@app.route("/home/<string:id>")
#def home(id:str):
#    return "Flores almagesti " +id 

@app.route("/manuscrit")
def manuscrit():
    donnees = [{
        "id":"Wit225",
        "date_min":"1401",
        "date_max":"1500",
        "loc":"Biblioteka Jagiellonska, Cracovie",
        "titre": "Flores Almagesti"

    },{
        "id":"Wit226",
        "date_min":"1474",
        "date_max":"1474",
        "loc":"Biblioteka Jagiellonska, Cracovie",
        "titre": "Flores Almagesti"
    },{
        "id":"Wit227",
        "date_min":"1401",
        "date_max":"1500",
        "loc":"BnF, Paris",
        "titre": "Flores Almagesti"
    },{
        "id":"Wit228",
        "date_min":"1401",
        "date_max":"1550",
        "loc":"Biblioteca Apostolica Vaticana, Vatican City",
        "titre": "Flores Almagesti"
    }
    ,{
        "id":"Wit229",
        "date_min":"1470",
        "date_max":"1471",
        "loc":"Biblioteca Apostolica Vaticana, Vatican City",
        "titre": "Flores Almagesti"
    },{
        "id":"Wit240",
        "date_min":"1450",
        "date_max":"1500",
        "loc":"Biblioteca Universitaria, Bologna",
        "titre": "Flores Almagesti"
    },{
        "id":"Wit241",
        "date_min":"1450",
        "date_max":"1500",
        "loc":"Biblioteca Comunale Augusta, Perugia",
        "titre": "Flores Almagesti"
    }]
    return render_template("pages/manuscrit.html", donnees=donnees,sous_titre="Manuscrit")

@app.route("/manuscrit/<string:nom>")
def pays_specifique(nom):
    info = []
    if nom in {"wit225","wit226","wit227","wit228","wit229","wit240","wit241"}:
        info = []
    return render_template("pages/manu_specifique.html", manuscrit=nom, info=info, sous_titre=nom)

@app.route("/diagramme")
def diag():
    donnees = []
    for diag in diagram.query.all():
        donnees.append({
        "id":diag.img_name,
        "wit":diag.id,
        "date_min":diag.date_min,
        "date_max":diag.date_max,
        "loc":diag.Cons_place,
        "titre": "Flores Almagesti"
        })
    return render_template("pages/diagram.html", donnees=donnees, sous_titre="liste des diagrammes")

@app.route("/diagramme/<int:page>")
def diagramm(page):
   donnees = []
   query =  diagram.query
   table=query.paginate(page=page, per_page=app.config["MANU_PER_PAGE"])

   return render_template("pages/diagram_spe.html", pagination=table, sous_titre="liste des diagrammes")
from flask import render_template,request

@app.route("/recherche_rapide")
@app.route("/recherche_rapide/<int:page>")
def recherche_rapide(page=1):
    chaine =  request.args.get("chaine", None)
    if chaine:
        resultats = diagram.query.\
            filter(
                or_(
                    diagram.img_name.ilike("%"+chaine+"%"),
                    diagram.id.ilike("%"+chaine+"%"),
                    diagram.City.ilike("%"+chaine+"%"),
                    diagram.Cons_place.ilike("%"+chaine+"%"),
                    diagram.date_max.ilike("%"+chaine+"%"),
                    diagram.date_min.ilike("%"+chaine+"%"),
                    diagram.Manuscript_name.ilike("%"+chaine+"%")
                )
            ).\
            distinct(diagram.img_name).\
            order_by(diagram.img_name).\
            paginate(page=page, per_page=app.config["MANU_PER_PAGE"])
    else:
        resultats = None
    return render_template("pages/resultats_recherche.html", 
            sous_titre=chaine, 
            donnees=resultats,
            requete=chaine)


