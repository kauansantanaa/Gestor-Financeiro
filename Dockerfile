FROM node:20 AS build-frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-backend

WORKDIR /app/backend

COPY backend/*.csproj ./
RUN dotnet restore

COPY backend/ ./
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

COPY --from=build-backend /app/publish .
COPY --from=build-frontend /app/frontend/dist ./wwwroot

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "GestorFinanceiro.Api.dll"]