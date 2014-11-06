angular.module('websql', [])

    .constant('DB_TABLES', [
        {
            name: "event",
            columns: [
                {
                    name: 'id',
                    type: 'integer primary key autoincrement'
                },
                {
                    name: 'title',
                    type: 'text'
                },
                {
                    name: 'description',
                    type: 'text'
                },
                {
                    name: 'date_create',
                    type: 'date'
                },
                {
                    name: 'date_start',
                    type: 'date'
                },
                {
                    name: 'isRepeat',
                    type: 'text'
                },
                {
                    name: 'date_end',
                    type: 'date'

                },
                {
                    name: 'repeats',
                    type: 'text'
                },
                {
                    name: 'repeatDays',
                    type: 'text',
                    stringify: true
                }
            ]
        }
    ])

    .constant('DB_CONFIG', {
        name: 'events',
        description: 'Database for events project',
        version: '1',
        size: 1024*1024*35 // 35 Mb
    })

    .factory('websqldb', ['DB_CONFIG', '$q', '$rootScope', function(DB_CONFIG, $q, $rootScope){
        var db = window.openDatabase(DB_CONFIG.name, DB_CONFIG.version, DB_CONFIG.description, DB_CONFIG.size);
        db.executeQuery = function(query, bindings){
            var deferred = $q.defer();
            var _this = this;
            bindings = typeof bindings !== 'undefined' ? bindings : [];
            this.transaction(function(transaction) {
                $rootScope.$broadcast('querying');
                transaction.executeSql(query, bindings, function(transaction, results) {
                    $rootScope.$broadcast('queried');
                    results = _this.convertResult(results);
                    deferred.resolve(results);
                }, function(transaction, error) {
                    $rootScope.$broadcast('queried');
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        };
        db.convertResult = function(results){
            var data = [];
            for (var i = 0; i < results.rows.length; i++) {
                var row = angular.copy(results.rows.item(i));
                data.push(row);
            }
            return data;
        };
        return db;
    }])

    .factory('websqlUtil', ['websqldb', '$q', 'DB_TABLES', "$filter", function(db, $q, DB_TABLES, $filter){

        function convertDateToDatetime(date, format){
            format = format || 'yyyy-MM-dd HH:mm:ss';
            return $filter('date')(date, format);
        }

        function getParamsString(length){
            var result = '';
            for(var i = 0; i < length; i++){
                result += '?';
                if( i < length-1 ){
                    result += ', ';
                }

            }
            return result;
        }

        function getTableSchema(tableName){
            var result = _.where(DB_TABLES, {
                name: tableName
            });
            return (result.length) ? result[0] : null;
        }

        function getColumnList(tableName){
            var tableSchema = getTableSchema(tableName);
            var string = "";

            for(var i = 0; i < tableSchema.columns.length; i++ ){
                if( tableSchema.columns[i].name == 'id' ) {
                    continue;
                }
                string += tableSchema.columns[i].name;
                if (i < tableSchema.columns.length - 1 ) {
                    string += ', ';
                }
            }
            return string;
        }

        function getColumnListForUpdate(tableName){
            var tableSchema = getTableSchema(tableName);
            var string = "";

            for(var i = 0; i < tableSchema.columns.length; i++ ){
                if( tableSchema.columns[i].name == 'id' ) {
                    continue;
                }
                string += tableSchema.columns[i].name + ' = ?';
                if (i < tableSchema.columns.length - 1 ) {
                    string += ', ';
                }
            }
            return string;
        }

        function getColumnArr(tableName){
            var arr = [];
            var tableSchema = getTableSchema(tableName);
            for(var i = 0; i < tableSchema.columns.length; i++ ){
                if( tableSchema.columns[i].name == 'id' ) {
                    continue;
                }
                arr.push(tableSchema.columns[i]);
            }
            return arr;
        }

        function getDataByTable(tableName, data){
            var columnArr = getColumnArr(tableName);
            return getDataByColumns(columnArr, data);
        }

        function getDataByColumns(columnArr, data){
            var result = [];
            angular.forEach(columnArr, function(column){
                var value = getDataByColumn(column, data[column['name']]);
                result.push(value);
            });
            return result;
        }

        function getDataByColumn(column, value){
            if( !value ){
                return '';
            }

            if(column.stringify){
                value = JSON.stringify(value);
            }

            if( column.type == 'date' ) {
                if( angular.isDate(value) ){
                    return convertDateToDatetime(value);
                }else{
                    try{
                        value = new Date(value);
                        return convertDateToDatetime(value);
                    } catch(e){
                        return '';
                    }
                }
            }else{
                return value;
            }
        }

        function resourcesToObjects(resources){
            var result = [];
            angular.forEach(resources, function(resource){
                result.push(resource.data);
            });
            return result;
        }

        function eventsByPeriodToObjects(days){
            var result = [];
            angular.forEach(days, function(day){
                day.events = resourcesToObjects(day.events);
                result.push(day);
            });
            return result;
        }

        function initDb(){
            var def = $q.defer();
            var promises = [];

            angular.forEach(DB_TABLES, function(table){
                var columns = [];
                angular.forEach(table.columns, function(column) {
                    columns.push(column.name + ' ' + column.type);
                });

                var removeTable = "DROP TABLE IF EXISTS `"+table.name+"`";
                var createTable = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                promises.push(db.executeQuery(removeTable));
                promises.push(db.executeQuery(createTable));
            });

            $q.all(promises).then(function(){
                def.resolve();
            });
            return def.promise;
        }

        return {
            eventsByPeriodToObjects: eventsByPeriodToObjects,
            getColumnListForUpdate: getColumnListForUpdate,
            convertDateToDatetime: convertDateToDatetime,
            resourcesToObjects: resourcesToObjects,
            getParamsString: getParamsString,
            getTableSchema: getTableSchema,
            getDataByTable: getDataByTable,
            getColumnList: getColumnList,
            getColumnArr: getColumnArr,
            initDb: initDb
        };
    }])

    .factory('websqlResource', ['websqldb', 'websqlUtil', '$q', function(db, $websqlUtil, $q){
        function WebSqlResourceFactory(tableName){

            var Resource = function(data){
                this.data = this.parse(data);
            };

            var thenFactoryMethod = function(promise, successcb, errorcb, isArray){
                var scb = successcb || angular.noop;
                var ecb = errorcb || angular.noop;

                return promise.then(
                    //success
                    function(response){
                        var result;
                        if(isArray){
                            result = [];
                            for (var i = 0; i < response.length; i++) {
                                result.push(new Resource(response[i]));
                            }
                        }else{
                            if (!response){
                                return $q.reject({
                                    code:'resource.notfound',
                                    tableName: tableName
                                });
                            } else {
                                result = new Resource(response.data);
                            }
                        }
                        scb(result, response.status, response.headers, response.config);
                        return result;
                    },
                    //error
                    function(response){
                        ecb(undefined, response.status, response.headers, response.config);
                        return undefined;
                    }
                );
            };

            Resource.query = function (query, bindings, successcb, errorcb) {
                var promise = db.executeQuery(query, bindings);
                return thenFactoryMethod(promise, successcb, errorcb, true);
            };

            Resource.all = function(successcb, errorcb){
                return Resource.query({}, [],  successcb, errorcb);
            };

            Resource.getById = function (id, successcb, errorcb) {
                var query = squel.select().from(tableName).where("id = '" + id + "'").toString();
                return Resource.query(query, [], successcb, errorcb);
            };

            Resource.prototype.save = function (successcb, errorcb) {
                if( !this.data.id ){
                    return this.create(arguments);
                }else{
                    return this.edit(arguments);
                }
            };

            Resource.prototype.parse = function(data){
                return data;
            };

            Resource.prototype.query = function(query, bindings){
                return db.executeQuery(query, bindings);
            };

            Resource.prototype.remove = function () {
                var deferred = $q.defer();
                var _this = this;

                var sql = "DELETE FROM event WHERE id='"+this.data.id+"'";

                this.query(sql, []).then(function(result){
                    deferred.resolve(_this);
                }, function(){
                    deferred.reject(_this);
                });

                return deferred.promise;
            };

            Resource.prototype.db  = db;

            Resource.prototype.create = function(successcb, errorcb){
                var deferred = $q.defer();
                var _this = this;

                var columnsArr = $websqlUtil.getColumnArr(tableName);
                var paramsStr = $websqlUtil.getParamsString(columnsArr.length);

                var columns = $websqlUtil.getColumnList(tableName);
                var data= $websqlUtil.getDataByTable(tableName, this.data);

                var sql = "INSERT INTO " + tableName + " ( " + columns + " ) VALUES(" + paramsStr + ")";

                this.query(sql, data).then(function(result){
                    _this.data.id = result.insertId;
                    deferred.resolve(_this);
                }, function(){
                    deferred.reject(_this);
                });

                return deferred.promise;
            };

            Resource.prototype.edit = function(successcb, errorcb){
                var deferred = $q.defer();
                var _this = this;

                var columns = $websqlUtil.getColumnListForUpdate(tableName);
                var data= $websqlUtil.getDataByTable(tableName, this.data);

                var sql = "UPDATE " + tableName + " SET " + columns +  " WHERE id=" + "'"+this.data.id+"'";

                this.query(sql, data).then(function(result){
                    _this.data.id = result.insertId;
                    deferred.resolve(_this);
                }, function(){
                    deferred.reject(_this);
                });

                return deferred.promise;
            };

            return Resource;
        }
        return WebSqlResourceFactory;
    }]);