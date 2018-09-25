/*
This file will contain the functions for logic layer.
By separating it from controller, we are separating the concerns.
Thus we can use it from other non express callers like cron etc
*/

exports.isUsageLimitReached = function (planUsage, companyUsage) {
  if (planUsage.facebook_pages !== -1 && companyUsage.facebook_pages >= planUsage.facebook_pages) {
    return true
  } else {
    return false
  }
}
