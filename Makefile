database-up:
	docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Password_123#" -p 1433:1433 --name sql_server_container -d mcr.microsoft.com/mssql/server
database-down:
	docker stop sql_server_container
cache-up:
	docker run -d --name redis-stack -p 6379:6379  redis/redis-stack-server:latest
cache-down:
	docker stop redis-stack