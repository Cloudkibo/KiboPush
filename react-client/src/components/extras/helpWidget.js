/* eslint-disable no-return-assign */
/**
 * Created by imran on 26/12/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import YouTube from 'react-youtube'
import ReactTooltip from 'react-tooltip'

class HelpWidget extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      openVideo: false
    }
    this.openVideoTutorial = this.openVideoTutorial.bind(this)

    this.documentation = {
      visibility: this.props.documentation.visibility,
      title: this.props.documentation.title || 'Documentation',
      link: this.props.documentation.link,
      iconClass: this.props.documentation.iconClass || 'la la-info-circle'
    }
    this.videoTutorial = {
      visibility: this.props.videoTutorial.visibility,
      title: this.props.videoTutorial.title || 'Video Tutorial',
      videoId: this.props.videoTutorial.videoId,
      iconClass: this.props.videoTutorial.iconClass || 'la la-play-circle'
    }
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoTutorial.click()
  }

  render () {
    return (
      <ul className="m-nav-sticky" style={{marginTop: '30px', backgroundColor: '#716aca'}}>

        <ReactTooltip
          place='left'
          type='dark'
          effect='solid'
        />

        <button style={{ display: 'none' }} ref='videoTutorial' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoTutorial">videoTutorial</button>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoTutorial" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Video Tutorial
                </h5>
                <button
                  style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({
                      openVideo: false
                    })
                  }}
                >
                  <span aria-hidden="true">
                    &times;
                  </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                {
                  this.state.openVideo &&
                  <YouTube
                    videoId={this.videoTutorial.videoId}
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0
                      }
                    }}
                  />
                }
              </div>
            </div>
          </div>
        </div>

        {
          this.documentation.visibility &&
          <li className="m-nav-sticky__item">
    				<a href={this.documentation.link} target="_blank" rel='noopener noreferrer'>
    					<i
                style={{fontSize: '25px', color: 'white'}}
                className={this.documentation.iconClass}
                data-tip={this.documentation.title}
              />
    				</a>
    			</li>
        }
        {
          this.videoTutorial.visibility &&
          <li className="m-nav-sticky__item">
    				<span style={{cursor: 'pointer'}} onClick={this.openVideoTutorial}>
    					<i
                style={{fontSize: '25px', color: 'white'}}
                className={this.videoTutorial.iconClass}
                data-tip={this.videoTutorial.title}
              />
    				</span>
    			</li>
        }
  		</ul>
    )
  }
}

HelpWidget.propTypes = {
  'documentation': PropTypes.exact({
    'visibility': PropTypes.bool.isRequired,
    'link': PropTypes.string,
    'title': PropTypes.string,
    'iconClass': PropTypes.string
  }).isRequired,
  'videoTutorial': PropTypes.exact({
    'visibility': PropTypes.bool.isRequired,
    'videoId': PropTypes.string,
    'title': PropTypes.string,
    'iconClass': PropTypes.string
  }).isRequired
}

export default HelpWidget
