import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ImpactDataPoint {
  year: number;
  credits: number;
  sequestration: number;
  price: number;
  value: number;
  presentValue: number;
}

interface ImpactChartProps {
  data: ImpactDataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const ImpactChart: React.FC<ImpactChartProps> = ({
  data,
  width = 800,
  height = 400,
  margin = { top: 20, right: 80, bottom: 30, left: 50 }
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.year) || 0])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.credits) || 0])
      .range([height - margin.bottom, margin.top]);

    // Create line generator for credits
    const creditsLine = d3.line<ImpactDataPoint>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.credits))
      .curve(d3.curveMonotoneX);

    // Create line generator for sequestration
    const sequestrationLine = d3.line<ImpactDataPoint>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.sequestration * 100)) // Scale for visualization
      .curve(d3.curveMonotoneX);

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale)
        .ticks(5)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(() => '')
      )
      .style('stroke', '#e0e0e0')
      .style('stroke-dasharray', '3,3');

    // Add y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .style('font-size', '12px')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('fill', '#666')
      .style('font-size', '12px')
      .text('Credits (units)');

    // Add y-axis for sequestration
    const yScale2 = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.sequestration) || 0])
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yScale2))
      .style('font-size', '12px')
      .append('text')
      .attr('transform', 'rotate(90)')
      .attr('y', -40)
      .attr('x', height / 2)
      .attr('text-anchor', 'middle')
      .style('fill', '#666')
      .style('font-size', '12px')
      .text('Sequestration (tonnes)');

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .style('font-size', '12px')
      .append('text')
      .attr('transform', `translate(${width / 2},30)`)
      .attr('text-anchor', 'middle')
      .style('fill', '#666')
      .style('font-size', '14px')
      .text('Year');

    // Add credits line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#1976d2')
      .attr('stroke-width', 2)
      .attr('d', creditsLine)
      .style('opacity', 0.8);

    // Add sequestration line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4caf50')
      .attr('stroke-width', 2)
      .attr('d', sequestrationLine)
      .style('opacity', 0.8);

    // Add data points for credits
    svg.selectAll('.credit-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'credit-dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.credits))
      .attr('r', 3)
      .style('fill', '#1976d2')
      .style('cursor', 'pointer')
      .on('mouseover', function(this: SVGCircleElement, event: MouseEvent, d: ImpactDataPoint) {
        // Show tooltip
        const parentNode = this.parentNode as Element;
        const tooltip = d3.select(parentNode)
          .append('g')
          .attr('class', 'tooltip');

        tooltip.append('rect')
          .attr('x', xScale(d.year) + 10)
          .attr('y', yScale(d.credits) - 30)
          .attr('width', 120)
          .attr('height', 40)
          .attr('fill', 'white')
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .attr('rx', 4)
          .style('opacity', 0.9);

        tooltip.append('text')
          .attr('x', xScale(d.year) + 20)
          .attr('y', yScale(d.credits) - 10)
          .text(`Year: ${d.year}`)
          .style('font-size', '12px');

        tooltip.append('text')
          .attr('x', xScale(d.year) + 20)
          .attr('y', yScale(d.credits) + 5)
          .text(`Credits: ${d.credits.toFixed(0)}`)
          .style('font-size', '12px');
      })
      .on('mouseout', function(this: SVGCircleElement) {
        const parentNode = this.parentNode as Element;
        d3.select(parentNode).select('.tooltip').remove();
      });

    // Add data points for sequestration
    svg.selectAll('.sequestration-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'sequestration-dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.sequestration * 100))
      .attr('r', 3)
      .style('fill', '#4caf50')
      .style('cursor', 'pointer')
      .on('mouseover', function(this: SVGCircleElement, event: MouseEvent, d: ImpactDataPoint) {
        // Show tooltip
        const parentNode = this.parentNode as Element;
        const tooltip = d3.select(parentNode)
          .append('g')
          .attr('class', 'tooltip');

        tooltip.append('rect')
          .attr('x', xScale(d.year) + 10)
          .attr('y', yScale(d.sequestration * 100) - 30)
          .attr('width', 140)
          .attr('height', 40)
          .attr('fill', 'white')
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .attr('rx', 4)
          .style('opacity', 0.9);

        tooltip.append('text')
          .attr('x', xScale(d.year) + 20)
          .attr('y', yScale(d.sequestration * 100) - 10)
          .text(`Year: ${d.year}`)
          .style('font-size', '12px');

        tooltip.append('text')
          .attr('x', xScale(d.year) + 20)
          .attr('y', yScale(d.sequestration * 100) + 5)
          .text(`Sequestration: ${d.sequestration.toFixed(1)}`)
          .style('font-size', '12px');
      })
      .on('mouseout', function(this: SVGCircleElement) {
        const parentNode = this.parentNode as Element;
        d3.select(parentNode).select('.tooltip').remove();
      });

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 10},${margin.top})`);

    // Credits legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 20)
      .attr('height', 2)
      .style('fill', '#1976d2');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 5)
      .text('Credits')
      .style('font-size', '12px')
      .style('fill', '#333');

    // Sequestration legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 20)
      .attr('width', 20)
      .attr('height', 2)
      .style('fill', '#4caf50');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 25)
      .text('Sequestration')
      .style('font-size', '12px')
      .style('fill', '#333');
  }, [data, width, height, margin]);

  return (
    <div className="impact-chart">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ImpactChart;