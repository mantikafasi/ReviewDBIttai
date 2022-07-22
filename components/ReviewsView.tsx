
import React, { Component, useState } from 'react'
import { getReviews } from '../Utils/ReviewDBAPI';
import ReviewComponent from "./ReviewComponent";

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

    render() {
        const reviews = this.state.reviews

        return (
            <div>
                {
                    (reviews.length !== 0) ? (reviews.map(review => {
                        return <ReviewComponent review={review} />
                    })) : (<div>Loading...</div>)
                }
            </div>
        )
    }

}
