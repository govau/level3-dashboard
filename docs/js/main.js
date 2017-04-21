/**
 * Sum all downloads up from the returning json format
 *
 * @param  {array} downloads - The downloads object coming from npms stats api
 *
 * @return {integer}         - All downloads summed together
 */
function getStats( downloads ) {
	let count = 0;

	if( downloads !== undefined ) {
		for( const download of downloads ) {
			count += download.downloads;
		}
	}

	return count;
}


/**
 * Get the stats for a specified bunch of packages from the npm api
 *
 * @param  {array} packages - An array of package names
 *
 * @return {integer}        - the download counts of all packages
 */
function getDownloads( packages ) {
	const data = [];
	const promises = [];

	return new Promise( ( resolve, reject ) => {
		for( const package of packages ) {
			promises.push(
				fetch(`https://api.npmjs.org/downloads/range/last-month/${ package }?${ Math.floor( new Date().getTime() / 1000 ) }`, { method: 'get' })
					.catch( error => reject( error ) )
					.then( response => response.json() )
					.then( thisData => data.push( getStats( thisData.downloads ) ) )
			);
		}


		Promise.all( promises )
			.catch( error => reject( error ) )
			.then( allDownloads => {
				resolve( data.reduce( ( sum, value ) => sum + value ) );
		});

	});
}


//packages to be checked
pancakePkgs = [
	'@gov.au/pancake',
	'@gov.au/pancake-sass',
	'@gov.au/pancake-js',
	'@gov.au/syrup',
];

//adding pancake downloads to page
getDownloads( pancakePkgs )
	.catch( error => console.error( error ) )
	.then( data => {
		document.getElementById("pancake-download").innerHTML = data;
});


//getting uikit packages
fetch(`https://raw.githubusercontent.com/govau/uikit/master/uikit.json?${ Math.floor( new Date().getTime() / 1000 ) }`, { method: 'get' })
	.catch( error => reject( error ) )
	.then( response => response.json() )
	.then( thisData => {
		uikitPkgs = Object.keys( thisData );

		//adding uikit downloads to page
		getDownloads( uikitPkgs )
			.catch( error => console.error( error ) )
			.then( data => {
				document.getElementById("uikit-download").innerHTML = data;
		});
});
