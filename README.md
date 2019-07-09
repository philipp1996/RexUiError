# Kindergarten

Guideline zum erstellen neuer Anleitungen:
   
   Im Ordner ,,content/Anleitungen" muss ein Ordner der neuen Anleitung erstellt werden
   
   In der .json Datei ,,Alle Anleitungen wird" ein Eintrag erstellt der als Namen den ORDNER-Name
   der neuen Anleitung erhält  
   
   Nun können alle Relevanten Bild Dateien in den Ordner kopiert werden
   
   In der Datei ,,setup.json" wird die Reihenfolge der Bilder festgelegt.
   Weiters wird hier der Name der Anleitung angegeben (Dieser Name wird in der Übersicht angezeigt).
   
   Wichtig ist der Parameter ,,filepräfix" dieser gibt den Namen der einzelnen Bilder an.
   Weiters kann der Dateityp angegben werden (Parameter: filetype).
   Wird nichts angegeben, so ist der Defaultwert ,,jpg".
   
   Der Parameter ,,Typ" gibt den Typ einer Anleitung an. Derzeit gibt es 3 Typen:
   lego,roboter und default. Wird kein typ angegeben, so ist dieser gleich default.
   Der Typ ändert das icon der Anleitung in der Übersicht.
   
   Weiters muss die Größe angegeben werden (Parameter size). Diese ist immer um 1 größer als der letzte Eintrag 
   der Bilder ({"id":47,"connection":[]} -> size 48).
   
   Für Standart Anleitungen die Linear sind, kann vorerst das Hilfsjavaprogramm ,,setupJSONhelper" zur 
   Hilfe genommen werden.
   Dies generiert Einträge nach angegbener Größe welche kopiert werden können.
   
    Bsp: 5
      {"id":0,"connection":[1]},
      {"id":1,"connection":[2]},
      {"id":2,"connection":[3]},
      {"id":3,"connection":[4]},
      {"id":4,"connection":[5]},
      {"id":5,"connection":[6]}
   Somit müssen diese nicht per Hand erstellt werden.
   Um nun Auswahlmöglichkeiten erstellen zu können, gibt man im Array mehrere IDs an:
   
       {"id":20,"connection":[21,22,23]},
   
   Wird also auf das Bild mit der ID 20 geklickt, so wird als nächstes eine Auswahlmöglichkeit der
   Bilder 21,22 und 23 gezeigt.
    
   Möchte man ein Bild als Ende kennzeichnen, so gibt man keine ID im Array an.
   
        {"id":30,"connection":[]},
   Es hat sich bewährt, für Bilder in einer Entscheidung beispielsweise das fertige Modell zu zeigen.
   Dieses Bild wird somit doppelt abgespeichert. 
   
   Richtlinien für Bilder:
    
        Einheitliches Dateiformat 
        vorzugsweise png,jpg oder jpeg
        Bilder sollten in Querformat aufegnommen sein
            Wenn nicht dann müssen die Bilder um eine verzerrung zu vermeiden 
            nachbearbeitet werden. Hierbei sollte das Format einbgehalten werden.
            Das Bild einfach in der Mitte positioniernen und einen weißen Hintergrund hinzufügen.
        Format 4:3
        Am besten mit Stativ aufgenommen( Helligkeitsunterschiede werden vermieden)
        Bilder sollten komprimiert sein (Onlinetool: https://tinyjpg.com/)
        Alle Bilder sollten den selben Dateinamen besitzen 
            filepräfix (id).dateiendung
   
   Die Dateinamen gehen am leichtesten bennenen indem man alle makiert und ihnen den filepräfix als Namen verpasst.
   Somit werden sie automatisch mit der ID durchnummeriert.