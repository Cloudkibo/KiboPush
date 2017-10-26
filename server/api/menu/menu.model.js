/**
 * Created by sojharo on 23/10/2017.
 */
'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let menuSchema = new Schema({
  pageId: {type: Schema.ObjectId, ref: 'pages'},
  userId: {type: Schema.ObjectId, ref: 'users'},
  title: String,
  menuId: String, // same as pageId for parent menu
  menuItemType: {
    type: String,
    enum: ['weblink', 'submenu', 'reply'],
    default: 'weblink'
  },
  menuWebLink: String, // only when type is 'weblink'
  parentMenuId: String, // only when it is submenu of parent menu, null for top level
  payload: Schema.Types.Mixed // only when type is 'reply'
})

module.exports = mongoose.model('menu', menuSchema)
