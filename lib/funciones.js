/* PROYECTO: COR PROCESSU MOBILE */
//var IP = "10.20.99.2"
//var IP = "User-PC"
var IP = "corprocessu.com"
var puerto = "8888"
//var puerto = "86"
var clave = "sid1029";


function redireccionar(url) 
{
	localStorage.regresar = url;
	window.open(url,"_self");
}

/* Abre una nueva ventana en la página de SID
 * 20120613
 */
function sid() {
	window.open("http://www.integradores.net");		
}

/* Limpia las variables del localStorage, y redirecciona al Login
 * 20120613
 */
function salir() {
	localStorage.clear();
	window.open("index.html","_self");	
}

/* Realiza la validación de los datos del login
 * 20121110 
 */
get_login = function ()
{
	var r;
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/login&callback=?login='+document.getElementById('textinput').value+'&pswd='+hex_md5(document.getElementById('password').value),
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			var html = "";
			if (response.status.id == 'OK') {
				//alert(response.login.active)
				//if (response.login.active == 'Y') {
					redireccionar('index.html\#menu_ppal');
					localStorage.nombre = response.login.login;
					localStorage.activo = 'S'; localStorage.c = 'S'; localStorage.p = 'S';
					localStorage.b = 'S'; localStorage.x = ""; localStorage.y = "ALL"; localStorage.be = '';
					localStorage.i = ''; localStorage.r = ''; localStorage.al = ''; localStorage.es = '';
				//} else {
				//	alert("Error! Usuario inactivo.");
				//}
			} else {
				alert("Error! " + response.status.message + '.');
			}
		}	
	});
}

/* Funcion que carga la pantalla de consulta de artículos disponibles.
 * 10/11/2012 MT
 */
ArticulosDisp = function () {
	var r;
	if (localStorage.x == "") {
		jQuery.ajax({
			url:'http://'+IP+':'+puerto+'/materiales&callback=?tipoc=1',
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				var html = '<label for="matcat1" class="select">Material:</label><select name="matcat1" id="matcat1" data-theme="b" onChange="ActMater()"><option value="">Seleccione</option>';
				for(var i=0; i < response.material.length; ++i){
					html+='<option value="'+response.material[i].cor_matcat_sec+'">'+response.material[i].cor_matcat_id+'</option>';
				}
				jQuery.ajax({
					url:'http://'+IP+':'+puerto+'/almacen&callback=?tipoc=1',
					dataType: 'jsonp',
					crossDomain: true,
					cache: false, 
					success: function(response) {
						var html2 = '<label for="alm" class="select">Almacén:</label><select name="alm" id="alm" data-theme="b" onChange="ActAlma()"><option value="ALL">Seleccione</option>';
						for(var i=0; i < response.material.length; ++i){
							html2+='<option value="'+response.material[i].cor_almacen_sec+'">'+response.material[i].cor_almacen_id+'</option>';
						}
						html2+='</select>'
						html+='</select>' + html2;
						$(html).appendTo("#matcat");
						redireccionar("ArticulosDisp.html\#CCodificacion");
					}	
				});
			}	
		});
	} else {
		jQuery.ajax({
			url:'http://'+IP+':'+puerto+'/materiales&callback=?tipoc=1',
			dataType: 'jsonp',
			crossDomain: true,
			cache: false, 
			success: function(response) {
				var html = '<label for="matcat1" class="select">Material:</label><select name="matcat1" id="matcat1" data-theme="b" onChange="ActMater()"><option value="">Seleccione</option>';
				for(var i=0; i < response.material.length; ++i){
					if (localStorage.x == response.material[i].cor_matcat_sec) {
						html+='<option value="'+response.material[i].cor_matcat_sec+'" selected>'+response.material[i].cor_matcat_id+'</option>';
					} else {
						html+='<option value="'+response.material[i].cor_matcat_sec+'">'+response.material[i].cor_matcat_id+'</option>';
					}
				}
				jQuery.ajax({
					url:'http://'+IP+':'+puerto+'/almacen&callback=?tipoc=1',
					dataType: 'jsonp',
					crossDomain: true,
					cache: false, 
					success: function(response) {
						var html2 = '<label for="alm" class="select">Almacén:</label><select name="alm" id="alm" data-theme="b" onChange="ActAlma()"><option value="ALL">Seleccione</option>';
						for(var i=0; i < response.material.length; ++i){
							if (localStorage.y == response.material[i].cor_almacen_sec) {
								html2+='<option value="'+response.material[i].cor_almacen_sec+'" selected>'+response.material[i].cor_almacen_id+'</option>';
							} else {
								html2+='<option value="'+response.material[i].cor_almacen_sec+'">'+response.material[i].cor_almacen_id+'</option>';	
							}
						}
						jQuery.ajax({
							url:'http://'+IP+':'+puerto+'/consultas&callback=?tipoc=1&mat='+localStorage.x+'&alm='+localStorage.y,
							dataType: 'jsonp',
							crossDomain: true,
							cache: false, 
							success: function(response) {
								var html3 = ''; html4 = "";
								nro = 0;
								for(var i=0; i < response.material.length; ++i){
									nro += elemento2.cant;
									html3 += '<li><h3>Almacén: '+response.material[i].cor_almacen_id+'; Cantidad: '+response.material[i].Cantidad+'</a></li>';
								}
								if (localStorage.y != "ALL") {
									html4+='<ul data-role="listview" data-inset="true"><li data-role="list-divider" role="heading" data-theme="b"><h3>Artículos Disponibles: '+nro+'</h3></li></ul>'
								} else {
									html4+='<ul data-role="listview" data-inset="true"><li data-role="list-divider" role="heading" data-theme="b"><h3>Artículos Disponibles: '+nro+'</h3></li>'
									html4+= html3 + '</ul>';
								}
								html2+='</select>';
								html+='</select>' + html2;
								$(html).appendTo("#matcat");
								$(html4).appendTo("#matcat_lista");
								redireccionar("ArticulosDisp.html\#CCodificacion");
							}	
						});
					}
				});
			}	
		});
	}
}

function ActMater(){
	select = document.getElementById("matcat1").options;
	index = document.getElementById("matcat1").selectedIndex;
	localStorage.x=select[index].value;	
}

function ActAlma(){
	select = document.getElementById("alm").options;
	index = document.getElementById("alm").selectedIndex;
	localStorage.y=select[index].value;
}

function limpiarFiltro(arg) {
	redireccionarC(arg);
}

function redireccionarC(url) {
	localStorage.regresar = url;
	localStorage.x = "";
	localStorage.y = "ALL"; 
	window.open(url,"_self");
}

/* Función auxiliar que inicializa las variables necesarias para consultar una composición	
 * Modificada 24/09/2012 Alvaro
 */
function PreConsultarComposicion(){
	localStorage.comp = "";
	localStorage.alm = "";
	redireccionar("ConsComposiciones.html");
}

/* Función que genera la pantalla de consultar composición
 * Modificada 03/10/2012 Alvaro
 */
function ConsultarComp(){
	//Servicio que busca las composiciones
	jQuery.ajax({
		url:'http://'+IP+':'+puerto+'/composiciones&callback=?tipoc=1',
		dataType: 'jsonp',
		crossDomain: true,
		cache: false, 
		success: function(response) {
			var html = '<div data-role="fieldcontain"><label for="comp">Composición:</label><select data-theme="b" name="comp" id="comp" data-theme = "b" ><option value="">Seleccione</option>';
			for(var i=0; i < response.material.length; ++i){
				if(localStorage.comp==response.material[i].cor_composicion_sec){
					html+= '<option value="'+response.material[i].cor_composicion_sec+'" selected> '+response.material[i].cor_composicion_id+'</option>';			
				}else{
					html+= '<option value="'+response.material[i].cor_composicion_sec+'"> '+response.material[i].cor_composicion_id+'</option>';
				}
			}
			html+='</select></div>';
			$(html).appendTo("#ConsultaComp");
			jQuery.ajax({
				url:'http://'+IP+':'+puerto+'/almacen&callback=?tipoc=1',
				dataType: 'jsonp',
				crossDomain: true,
				cache: false, 
				success: function(responsea) {
					html='<div data-role="fieldcontain"><label for="alm">Almacen:</label><select data-theme="b" name="alm" id="alm" data-theme = "b" ><option value="">Seleccione</option>';
					for(var i=0; i < responsea.material.length; ++i){
						if(localStorage.alm==responsea.material[i].cor_almacen_sec){
							html+='<option value="'+responsea.material[i].cor_almacen_sec+'" selected>'+responsea.material[i].cor_almacen_id+'</option>';
						} else {
							html+='<option value="'+responsea.material[i].cor_almacen_sec+'">'+responsea.material[i].cor_almacen_id+'</option>';
						}
					}
					html+='</select></div>';
					$(html).appendTo("#ArtA");
					var nro = 0;
					if(localStorage.comp!=''){
						//Servicio que busca los datos de todas las composiciones 
						jQuery.ajax({
							url:'http://'+IP+':'+puerto+'/composiciones&callback=?tipoc=2&compsec='+localStorage.comp,
							dataType: 'jsonp',
							crossDomain: true,
							cache: false, 
							success: function(responsea) {
								/*jQuery.get("http://"+IP+":"+puerto+"/t_cor_inv_composicion_0002_consulta_composicion",{"TK":clave,"comp":localStorage.comp,"alm":localStorage.alm},function(resultado){
									miRes = jQuery.parseJSON(resultado);
									html2 = '';
									$.each(miRes,function(i,elemento){
										if(i==0){
											nro=elemento.dis;
										}else{
											html2+='<p><ul data-role="listview" data-inset="true" id="Restan"><li data-role="list-divider" role="heading"><h3>Almacen: '+elemento.id+'; Disponibles: '+elemento.disp+'; Restan: </h3></li>';
											$.each(elemento.data,function(ii,elemento1){
												html2+='<li>'+ elemento1.matcat +': '+elemento1.res+'</li>';
											});
											html2+='</ul></p>';
										}
									});
									*/
							}
						});
					}else{redireccionar("ConsComposiciones.html\#consulta_comp");}
				}	
			});
		}	
	});
}
