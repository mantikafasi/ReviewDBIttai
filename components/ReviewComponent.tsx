import { findByProps } from 'ittai/webpack';
import React, { Component } from 'react'

const cozyMessage = findByProps("cozyMessage").cozyMessage
const avatar = findByProps("avatar", "zalgo").avatar
const username = findByProps("header","zalgo").header
const messageContent = findByProps("messageContent","zalgo").messageContent
const message = findByProps("message").message
const groupStart = findByProps("groupStart").groupStart
const wrapper = findByProps("wrapper","zalgo").wrapper
const cozy = findByProps("cozy","zalgo").cozy
const { contents } = findByProps("contents")

type ReviewProps = {
  username: string,
  comment: string,
  discordid: number,
}

export default class ReviewComponent extends Component<ReviewProps> {
  
  render() {
    return (
      <div>
        
        <div className={cozyMessage + " " + message + " " + groupStart + " " + wrapper + " " + cozy}>
          <div className={contents}>
            <img className={avatar} src="https://github.com/Aliucord.png?size=80"></img>


            <h2 className={username}>{this.props.username}</h2>
            <p className={messageContent}>{this.props.comment}</p>
          </div>
        </div>
      </div>
    )
  }
}
