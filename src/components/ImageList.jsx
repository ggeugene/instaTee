import React, { Component } from 'react';
import DraggableImage from './DraggableImage';
import { connect } from 'react-redux';

class ImageList extends Component {
    render() {
        const { area, controls } = this.props;
        return this.props.images.map(image => (
            <DraggableImage key={image.id} {...image} area={area} controls={controls} />
        ));
    }
}

const mapStateToProps = state => ({
    images: state.layers.filter(layer => layer.type === 'image' && layer.view === state.activeView),
});

export default connect(
    mapStateToProps,
    null
)(ImageList);
