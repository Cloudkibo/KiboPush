commit d2a9d7a254a4286d4afbe64006e0645f4120b673
Author: dayemsiddiqui <dayem.siddiqui@khi.iba.edu.pk>
Date:   Wed Jan 10 02:05:20 2018 +0500

    Convo

diff --git a/client/src/containers/convo/convo.js b/client/src/containers/convo/convo.js
index d08a68f..0061880 100644
--- a/client/src/containers/convo/convo.js
+++ b/client/src/containers/convo/convo.js
@@ -206,7 +206,7 @@ class Convo extends React.Component {
                       </div>
                       <div className='m-portlet__head-tools'>
                         {
-                          this.props.subscribers && this.props.subscribers.length !== 0
+                          this.props.subscribers && this.props.subscribers.length === 0
                             ? <a href='#'>
                               <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled>
                                 <span>
