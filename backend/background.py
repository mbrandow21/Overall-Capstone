import time
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import *
from dotenv import load_dotenv
import pyodbc
from dbconnection import dbconnection
import os
load_dotenv()

# This is the function that will be the logic behind the Audit's being sent
# Checks every 5 minutes to see if emails need to be sent.
def audit_invocations():
  while True:
    new_audits = check_for_new_audits()
    if new_audits:
      for audit in new_audits:
        sendAudit(audit)
    time.sleep(5)
  
  # This checks to see if there are any new "Audits" that need to go out.
  # If there are any new audits, pass the ID of that audit.
def check_for_new_audits():
  # string = [{"Audit_ID": 1,},{"Audit_ID": 2}]
  connection_string = dbconnection()
  with pyodbc.connect(connection_string) as connection:
    with connection.cursor() as cursor:
      try:
        cursor.execute("SELECT A.Audit_ID FROM Audits A WHERE A.Audit_ID=5")
        rows=cursor.fetchall()
        if (rows):
          return(rows)
        else: return None
      except pyodbc.IntegrityError:
        # Handle duplicate usernames
        return None
      except pyodbc.Error as e:
        # Handle other database errors
        print("Database error:", e)
        return None
    
  # This runs the logic to pass into sendAuditEmails to successfully send the emails.
def sendAudit(Audit):
  # sendAuditEmails(fromEmail='jmcdonald46@my.gcu.edu', toEmails='basemasonb@gmail.com', 
  #                 templateID='d-a6f21258e2c04655b93b41397127ccac')
  auditID = (Audit[0])
  sql = 'EXEC api_CORE_SendAuditInformation @auditID=?'
  connection_string = dbconnection()

  with pyodbc.connect(connection_string) as connection:
    with connection.cursor() as cursor:
      try:
        cursor.execute(sql, auditID)
        rows=cursor.fetchall()
        toEmails = [row[0] for row in rows]
        cursor.nextset()
        rows2=cursor.fetchall()
        fromEmail = rows2
        print(toEmails)
        print('From:', fromEmail)
        sendAuditEmails(fromEmail=fromEmail[0][0], toEmails=toEmails, templateID='d-a6f21258e2c04655b93b41397127ccac')
      except pyodbc.IntegrityError:
        # Handle duplicate usernames
        return None
      except pyodbc.Error as e:
        
        # Handle other database errors
        print("Database error:", e)
        return None

  # Send the SendGrid emails with passed in parameters.
def sendAuditEmails(fromEmail, toEmails, templateID=None, template=None):
  message = Mail(
      from_email=fromEmail,
      to_emails= To(toEmails)
  )

  if (templateID):
    message.template_id = templateID
  if (template):
    message.dynamic_template_data = template

  sg = SendGridAPIClient(api_key=(os.environ.get("SENDGRID_KEY")))
  response = sg.send(message)
  print(response.status_code, response.body, response.headers)