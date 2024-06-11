from .config import Config
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import sqlite3


app=Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)


from .routes import generales

