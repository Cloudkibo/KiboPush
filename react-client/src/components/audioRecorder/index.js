/* eslint-disable no-return-assign */
/**
 * Created by imran on 26/12/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

// To display sound waves
import { ReactMic } from 'react-mic'

// For record audio
import MicRecorder from 'mic-recorder-to-mp3'
const Mp3Recorder = new MicRecorder({ bitRate: 128 })

class AudioRecorder extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isRecording: props.recording,
      isBlocked: false
    }
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
  }

  startRecording () {
    if (this.state.isBlocked) {
      console.log('Audio Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  }

  stopRecording () {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        this.props.onDoneRecording({blob, buffer, blobURL})
        this.setState({ isRecording: false });
      }).catch((e) => console.log(e));
  }

  componentDidMount() {
    navigator.getUserMedia({ audio: true },
      () => {
        this.setState({ isBlocked: false });
      },
      () => {
        this.setState({ isBlocked: true })
      },
    );
  }

  render () {
    return (
      <div>
        {
          this.props.displaySoundWave &&
          <ReactMic style={{ width: '450px' }}
            width='450'
            record={this.state.isRecording}
            className='sound-wave'
            onStop={() => {}}
            strokeColor='#000000'
          />
        }
        <br />
        {
          this.state.isBlocked
          ? <div className="m-alert m-alert--icon m-alert--outline alert alert-danger fade show" role="alert">
            <div className="m-alert__icon">
              <i className="la la-warning" />
						</div>
            <div className="m-alert__text">
              Please allow KiboPush to access your MicroPhone
            </div>
					</div>
          : !this.state.isRecording
          ? <div role='dialog' aria-label='Voice clip' style={{ fontSize: '14px', height: '178px', overflow: 'hidden', width: '220px' }}>
            <div style={{ display: 'block', fontSize: '14px' }}>
              <div style={{ height: '0px', width: '0px', backgroundColor: '#333', borderRadius: '50%', opacity: '.2', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }} />
              <div onClick={this.startRecording} style={{ cursor: 'pointer', backgroundColor: '#f03d25', borderRadius: '72px', color: '#fff', height: '72px', transition: 'width .1s, height .1s', width: '72px', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <span style={{ left: '50%', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center', cursor: 'pointer', fontSize: '14px' }}>Record</span>
              </div>
            </div>
          </div>
          : <div role='dialog' aria-label='Voice clip' style={{ fontSize: '14px', height: '178px', overflow: 'hidden', width: '220px' }}>
            <div style={{ display: 'block', fontSize: '14px' }}>
              <div style={{ height: '90px', width: '90px', backgroundColor: '#333', borderRadius: '50%', opacity: '.2', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }} />
              <div data-dismiss={this.props.closeModalOnStop && 'modal'} onClick={this.stopRecording} style={{ cursor: 'pointer', borderRadius: '54px', height: '54px', width: 54, backgroundColor: '#f03d25', color: '#fff', transition: 'width .1s, height .1s', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <span style={{ height: '14px', width: '14px', backgroundColor: '#fff', left: '50%', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center', cursor: 'pointer', fontSize: '14px' }} />
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

AudioRecorder.defaultProps = {
  'displaySoundWave': true
}

AudioRecorder.propTypes = {
  'displaySoundWave': PropTypes.bool,
  'onDoneRecording': PropTypes.func.isRequired,
  'closeModalOnStop': PropTypes.bool.isRequired
}

export default AudioRecorder
