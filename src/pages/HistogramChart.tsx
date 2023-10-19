import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import {API} from "@/pages/api/hello";

const HistogramChart = () => {
    const svgRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API);
                const data = response.data[0].finance.periods[0].graph.month;

                // @ts-ignore
                const svg = d3.select(svgRef.current);

                const width = 800;
                const height = 400;
                const margin = { top: 20, right: 30, bottom: 40, left: 50 };
                const innerWidth = width - margin.left - margin.right;
                const innerHeight = height - margin.top - margin.bottom;

                svg.attr('width', width).attr('height', height);

                const xScale = d3
                    .scaleBand()
                    .domain(Object.keys(data))
                    .range([0, innerWidth])
                    .padding(0.4);

                const yScale = d3
                    .scaleLinear()
                    // @ts-ignore
                    .domain([0, d3.max(Object.values(data))])
                    .nice()
                    .range([innerHeight, 0]);

                const g = svg
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                g.selectAll('rect')
                    .data(Object.entries(data))
                    .enter()
                    .append('rect')
                    // @ts-ignore
                    .attr('x', d => xScale(d[0]))
                    .attr('y', innerHeight)
                    .attr('width', xScale.bandwidth())
                    .attr('height', 0)
                    .attr('fill', '#0000FF')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2)
                    .on('mouseover', (event, d) => {
                        const [month, value] = d;
                        // @ts-ignore
                        d3.select(tooltipRef.current)
                            .style('opacity', 1)
                            .html(`Месяц: ${month}<br>Значение: ${value}`)
                            .style('left', event.pageX + 'px')
                            .style('top', event.pageY - 28 + 'px');
                    })
                    .on('mouseout', () => {
                        // @ts-ignore
                        d3.select(tooltipRef.current).style('opacity', 0);
                    })
                    .transition()
                    .duration(1000)
                    // @ts-ignore
                    .attr('y', d => yScale(d[1]))
                    // @ts-ignore
                    .attr('height', d => innerHeight - yScale(d[1]));

                g.append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', `translate(0,${innerHeight})`)
                    .call(d3.axisBottom(xScale));

                g.append('g')
                    .attr('class', 'y-axis')
                    .call(d3.axisLeft(yScale).ticks(5));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <svg
                className="svgRef"
                // @ts-ignore
                ref={svgRef}
            >
            </svg>
            <div
                // @ts-ignore
                ref={tooltipRef}
                className='static'

            >
            </div>
        </div>
    );
};

export default HistogramChart;
