$(function() {
	$.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(j) {

		j.features.sort(function(a, b) { // svg elements have no z-index to set
			return b.properties.mass - a.properties.mass;
		});
		// so we have to make sure the big elements are rendered first (behind) so the smaller ones are selectable

		const width = 1900;
		const height = 900;

		$('#world').css({
			'width': width,
			'height': height,
		});

		const svg = d3.select('body')
			.append('svg')
			.attr('height',  height)
			.attr('width', width);



		const xScale = d3.scaleLinear()
			.domain([-180, 180]) // longitude is measured from -180deg to 180deg
			.range([0, width]);

		const yScale = d3.scaleLinear()
			.domain([-49, 87]) // north pole is positive, and at the top of the screen
			.range([height, 0]); // so we invert the height since these graphs are Y-DOWN

		// not -90, 90 because the map is cropped (no meteors at the poles)

		const rScale = d3.scalePow().exponent(0.4)
			.domain(d3.extent(j.features, function(d) { return d.properties.mass }))
			.range([0, 2]);

		let timeout = '';

		const circles = svg.selectAll('circle')
			.data(j.features)
			.enter()
			.append('circle')
			.attr('r', function(d) { return rScale(d.properties.mass); })
			.attr('class', 'meteor')
			.attr('transform', function(d) {
				if (d.geometry === null) {
					return '';
				} else {
					return ('translate(' + xScale(d.geometry.coordinates[0]) + ' ' + yScale(d.geometry.coordinates[1]) + ')');
				}
			}).on('mouseover', function(d) {
				$('#info').fadeIn(200);
				clearTimeout(timeout);
				$('#info').css('top', d3.event.pageY + 30).css('left', d3.event.pageX + 10);
				$('#info').html('Name: ' + d.properties.name + '<br>'
				+ 'Mass: ' + (d.properties.mass.slice(0, -3) || '0') + 'kg<br>' + 'ID: ' + d.properties.id + '<br>Class: ' + d.properties.recclass + '<br>Year: ' + d.properties.year.slice(0, 4));

			})
			.on('mouseout', () => {
				timeout = setTimeout(() => {
					$('#info').fadeOut(500);
				}, 300);
			});

	});
});
