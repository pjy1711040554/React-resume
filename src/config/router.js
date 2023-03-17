import React from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom';
import index from '../views/index'
import years from '../views/years'
import message from '../views/message'
import empty from '../views/empty'

function router() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/years" component={years}/>
                <Route path="/message/:id?" component={message}/>
                <Route exact path="/infocenter/:id?" component={index}/>
                <Route component={empty}></Route>
            </Switch>
        </HashRouter>
    )
}

export default router
