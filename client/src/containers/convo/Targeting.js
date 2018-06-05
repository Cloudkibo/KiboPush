import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadCustomerLists } from '../../redux/actions/customerLists.actions'
import { loadTags } from '../../redux/actions/tags.actions'

class Targeting extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      Gender: {
        options: [{id: 'male', text: 'male'},
          {id: 'female', text: 'female'},
          {id: 'other', text: 'other'}
        ]
      },
      Locale: {
        options: [{id: 'en_US', text: 'en_US'},
          {id: 'af_ZA', text: 'af_ZA'},
          {id: 'ar_AR', text: 'ar_AR'},
          {id: 'az_AZ', text: 'az_AZ'},
          {id: 'pa_IN', text: 'pa_IN'}
        ]
      },
      page: {
        options: []
      },
      pageValue: [],
      genderValue: [],
      localeValue: [],
      tagValue: [],
      selectedRadio: '',
      listSelected: '',
      isList: false,
      lists: []
    }
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.initializeGenderSelect = this.initializeGenderSelect.bind(this)
    this.initializeLocaleSelect = this.initializeLocaleSelect.bind(this)
    this.initializeTagSelect = this.initializeTagSelect.bind(this)
    this.initializeListSelect = this.initializeListSelect.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.resetTargeting = this.resetTargeting.bind(this)
    props.loadTags()
    props.loadCustomerLists()
  }

  componentDidMount () {
    let options = []
  //  this.props.onRef(this)

    if (this.props.pages) {
      for (var i = 0; i < this.props.pages.length; i++) {
        options[i] = {id: this.props.pages[i].pageId, text: this.props.pages[i].pageName}
      }
    }

    this.setState({page: {options: options}})
    this.initializeGenderSelect(this.state.Gender.options)
    this.initializeLocaleSelect(this.state.Locale.options)
    this.initializePageSelect(options)
    /* eslint-disable */
    $('.selectSegmentation').addClass('hideSegmentation')
    $('.selectList').addClass('hideSegmentation')
    /* eslint-enable */
  }
  resetTargeting () {
    this.setState({
      pageValue: [],
      genderValue: [],
      localeValue: [],
      selectedRadio: '',
      listSelected: '',
      isList: false,
      lists: [],
      tagValue: []
    })
      /* eslint-disable */
    $('.selectSegmentation').addClass('hideSegmentation')
    $('.selectList').addClass('hideSegmentation')
    $('#selectLists').addClass('hideSegmentation')
    $('#selectPage').val('').trigger('change')
    $('#selectGender').val('').trigger('change')
    $('#selectLocale').val('').trigger('change')
    $('#selectTags').val('').trigger('change')
      /* eslint-enable */
  }
  initializeListSelect (lists) {
    var self = this
    /* eslint-disable */
    $('#selectLists').select2({
    /* eslint-enable */
      data: lists,
      placeholder: 'Select Lists',
      allowClear: true,
      tags: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectLists').on('change', function (e) {
    /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ listSelected: selected })
        self.props.handleTargetValue({
          listSelected: selected,
          pageValue: self.state.pageValue,
          genderValue: self.state.genderValue,
          localeValue: self.state.localeValue,
          tagValue: self.state.tagValue
        })
      }
    })

    /* eslint-disable */
    $('#selectLists').val('').trigger('change')
    /* eslint-enable */
  }
  initializePageSelect (pageOptions) {
    var self = this
    /* eslint-disable */
    $('#selectPage').select2({
      /* eslint-enable */
      data: pageOptions,
      placeholder: 'Select Pages - Default: All Pages',
      allowClear: true,
      multiple: true
    })

    // this.setState({pageValue: pageOptions[0].id})

    /* eslint-disable */
    $('#selectPage').on('change', function (e) {
      /* eslint-enable */
      // var selectedIndex = e.target.selectedIndex
      // if (selectedIndex !== '-1') {
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ pageValue: selected })
        self.props.handleTargetValue({
          listSelected: self.state.listSelected,
          pageValue: selected,
          genderValue: self.state.genderValue,
          localeValue: self.state.localeValue,
          tagValue: self.state.tagValue
        })
      }
    })
  }

  initializeGenderSelect (genderOptions) {
    var self = this
    /* eslint-disable */
    $('#selectGender').select2({
      /* eslint-enable */
      data: genderOptions,
      placeholder: 'Select Gender',
      allowClear: true,
      multiple: true
    })

    /* eslint-disable */
    $('#selectGender').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ genderValue: selected })
        self.props.handleTargetValue({
          listSelected: self.state.listSelected,
          pageValue: self.state.pageValue,
          genderValue: selected,
          localeValue: self.state.localeValue,
          tagValue: self.state.tagValue
        })
      }
    })
  }

  initializeLocaleSelect (localeOptions) {
    var self = this
    /* eslint-disable */
    $('#selectLocale').select2({
      /* eslint-enable */
      data: localeOptions,
      placeholder: 'Select Locale',
      allowClear: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectLocale').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ localeValue: selected })
        self.props.handleTargetValue({
          listSelected: self.state.listSelected,
          pageValue: self.state.pageValue,
          genderValue: self.state.genderValue,
          localeValue: selected,
          tagValue: self.state.tagValue
        })
      }
    })
  }

  initializeTagSelect (tagOptions) {
    let remappedOptions = []

    for (let i = 0; i < tagOptions.length; i++) {
      let temp = {
        id: tagOptions[i].tag,
        text: tagOptions[i].tag
      }
      remappedOptions[i] = temp
    }
    var self = this
      /* eslint-disable */
    $('#selectTags').select2({
      /* eslint-enable */
      data: remappedOptions,
      placeholder: 'Select Tags',
      allowClear: true,
      multiple: true
    })
      /* eslint-disable */
    $('#selectTags').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ tagValue: selected })
        self.props.handleTargetValue({
          listSelected: self.state.listSelected,
          pageValue: self.state.pageValue,
          genderValue: self.state.genderValue,
          localeValue: self.state.localeValue,
          tagValue: selected
        })
      }
    })
  }
  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'list') {
      this.setState({genderValue: [], localeValue: [], tagValue: [], isList: true})
      /* eslint-disable */
      $('.selectSegmentation').addClass('hideSegmentation')
      $('.selectList').removeClass('hideSegmentation')
      /* eslint-enable */
    } if (e.currentTarget.value === 'segmentation') {
      /* eslint-disable */
      $('.selectSegmentation').removeClass('hideSegmentation')
      $('.selectList').addClass('hideSegmentation')
      /* eslint-enable */
      this.setState({listSelected: [], isList: false})
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.resetTarget) {
      this.resetTargeting()
    }
    if (nextProps.customerLists) {
      let options = []
      for (var j = 0; j < nextProps.customerLists.length; j++) {
        if (!(nextProps.customerLists[j].initialList)) {
          options.push({id: nextProps.customerLists[j]._id, text: nextProps.customerLists[j].listName})
        } else {
          if (nextProps.customerLists[j].content && nextProps.customerLists[j].content.length > 0) {
            options.push({id: nextProps.customerLists[j]._id, text: nextProps.customerLists[j].listName})
          }
        }
      }
      this.setState({lists: options})
      this.initializeListSelect(options)
      if (options.length === 0) {
        this.state.selectedRadio = 'segmentation'
      }
    }
    if (this.props.tags) {
      this.initializeTagSelect(this.props.tags)
    }
  }

  render () {
    return (
      <div className='row'>
        <div className='col-12' style={{paddingLeft: '20px', paddingBottom: '30px'}}>
          <i className='flaticon-exclamation m--font-brand' />
          <span style={{marginLeft: '10px'}}>
            If you do not select any targeting, broadcast message will be sent to all the subscribers from the connected pages.
          </span>
        </div>
        <div className='col-12' style={{paddingLeft: '20px'}}>
          <label>Select Page:</label>
          <div className='form-group m-form__group'>
            <select id='selectPage' style={{width: 200 + '%'}} />
          </div>
          <label>Select Segmentation:</label>
          <div className='radio-buttons' style={{marginLeft: '37px'}}>
            <div className='radio'>
              <input id='segmentAll'
                type='radio'
                value='segmentation'
                name='segmentationType'
                onChange={this.handleRadioButton}
                checked={this.state.selectedRadio === 'segmentation'} />
              <label>Apply Basic Segmentation</label>
            </div>
            { this.state.selectedRadio === 'segmentation'
              ? <div className='m-form selectSegmentation '>
                <div className='form-group m-form__group'>
                  <select id='selectGender' style={{minWidth: 75 + '%'}} />
                </div>
                <div className='form-group m-form__group' style={{marginTop: '-10px'}}>
                  <select id='selectLocale' style={{minWidth: 75 + '%'}} />
                </div>
                <div className='form-group m-form__group' style={{marginTop: '-18px', marginBottom: '20px'}}>
                  <select id='selectTags' style={{minWidth: 75 + '%'}} />
                </div>
              </div>
            : <div className='m-form selectSegmentation hideSegmentation'>
              <div className='form-group m-form__group'>
                <select id='selectGender' style={{minWidth: 75 + '%'}} disabled />
              </div>
              <div className='form-group m-form__group' style={{marginTop: '-10px'}}>
                <select id='selectLocale' style={{minWidth: 75 + '%'}} disabled />
              </div>
              <div className='form-group m-form__group' style={{marginTop: '-18px', marginBottom: '20px'}}>
                <select id='selectTags' style={{minWidth: 75 + '%'}} disabled />
              </div>
            </div>
            }
            { (this.state.lists.length === 0)
            ? <div className='radio'>
              <input id='segmentList'
                type='radio'
                value='list'
                name='segmentationType'
                disabled />
              <label>Use Segmented Subscribers List</label>
              <div style={{marginLeft: '20px'}}>
                <Link to='/segmentedLists' style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}> See Segmentation Here</Link></div>
            </div>
            : <div className='radio'>
              <input id='segmentList'
                type='radio'
                value='list'
                name='segmentationType'
                onChange={this.handleRadioButton}
                checked={this.state.selectedRadio === 'list'} />
              <label>Use Segmented Subscribers List</label>
              <div style={{marginLeft: '20px'}}>
                <Link to='/segmentedLists' style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}> See Segmentation Here</Link></div>
            </div>
            }
            <div className='m-form'>
              { this.state.selectedRadio === 'list'
            ? <div className='selectList form-group m-form__group'>
              <select id='selectLists' style={{minWidth: 75 + '%'}} />
            </div>
            : <div className='selectList form-group m-form__group'>
              <select id='selectLists' style={{minWidth: 75 + '%'}} disabled />
            </div>
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    customerLists: (state.listsInfo.customerLists),
    tags: (state.tagsInfo.tags)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadCustomerLists: loadCustomerLists,
    loadTags: loadTags
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Targeting)
