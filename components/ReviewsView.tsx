
import { TextInput } from 'ittai/components';
import { findByProps } from 'ittai/webpack';
import React, { Component, useState } from 'react'
import { addReview, getReviews } from '../Utils/ReviewDBAPI';
import ReviewComponent from "./ReviewComponent";
const { Editable } = findByProps("Editable")
type ReviewsViewProps = {
    userid: number
}

interface IState {
    reviews: any[];
}

export const Queue = {
    last: Promise.resolve(),
    push(func:any) {
        return (this.last = this.last.then(func));
    }
};
export default class ReviewsView extends Component<any,IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            reviews : []
        }
    }

    componentDidMount(): void {
        const reviews = this.state.reviews
        
        if (reviews.length === 0) { 
            getReviews(this.props.userid).then(reviews => {
                console.log(reviews)
                this.setState({ reviews: reviews });
            })
        }
    }   

    onClick(...args:any) {
        console.log("clicked")
        console.log(args)
    }

    render() {
        const reviews = this.state.reviews

        return (
            <div>
                {
                    (reviews.length !== 0) ? (reviews.map(review => {
                        return <ReviewComponent review={review} />
                    })) : (<div>Loading...</div>)
                }
                
                <Editable placeholder='Enter a comment' onChange={this.onClick}></Editable>
            </div>
        )
    }

}
