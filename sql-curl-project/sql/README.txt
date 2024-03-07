Lisää tietokantaan taulut:
sqlite3 test.db < create_football.sql
sqlite3 test.db < create_manager.sql

Lisää tauluihin dataa:
sqlite3 test.db < insert_football.sql
sqlite3 test.db < insert_manager.sql

Tyhjennä data:
sqlite3 test.db < delete_football.sql
sqlite3 test.db < delete_manager.sql