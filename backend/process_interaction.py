"""
Process the log without considering the outliers
"""
import numpy as np
import matplotlib.pyplot as plt

InteractionTypes = {
    "CLICK": "click",
    "MOUSEENTER": "mouseenter",
    "SCROLL": "scroll",
    "CHANGE_PDF_PAGE": "change_PDF_page",
    "LOGOUT": "logout",
    "VISIBLE":"visible",
    "HIDDEN":"hidden",
    "ENTER":"enter",  
    "LEAVE":"leave",   
    "CLOSE":"close"  
}

InteractionElements = {
    "NAVBAR": "navbar",
    "PROGRESS": "progress",
    "PDFTEXT": "PDF",
    "PDFTAB": "PDFTab",
    "COMMENT": "comment",
    "PROFILE": "profile",
    "RATING": "rating",
    "WINDOW":"window",
    "INDIVIDUAL_VIEW": "individual_view"
}

DOCTYPES = ['PS', 'Resume', 'LOR1', 'LOR2',  'Transcripts'];

""" 
    parmas: intervals: interaction intervals,a dictonary where key is applicant_id, and value is a list of interaction interval 
            durations: a list of durations
    output: a dictionary of focutime. key:applicant_id, val: a dictionary of the applicant's focus time distribution: key: doc type and total_time, val: time in minutes
"""
def process_intervals(intervals, durations):

    log_durations = np.log(durations)


    Q1 = np.quantile(log_durations, .25)
    Q3 = np.quantile(log_durations, .75)
    IQR = Q3 -Q1
    lower_bound = Q1 - 1.5*IQR
    upper_bound = Q3 + 1.5*IQR

    res = {}
   
    # get all the applicant ids, initialize the dictionary to be returned
    for id in intervals.keys():
        res[id] = {}
        for doc in DOCTYPES:
            res[id][doc] = 0

    # key: applicant_id, val: intervals
    for key, val in intervals.items():
       
        total = 0
        for interval in val:
            doc = interval['doc']
            duration = interval['duration']
            if np.log(duration) < upper_bound:
            # if duration > lower_bound and duration < upper_bound:  # remove noise

            # if duration > upper_bound:
            #      print(doc, duration)
                total += duration
                if doc in DOCTYPES:
                    res[key][doc] += duration
            else:
                print("outlier", doc, duration, key)
        
        res[key]['total'] = total
            

    return res



def process_interaction(logs):
    if len(logs) > 1: # need at least 2 interactions to get an interval

    # logs = mysql_handler.get_interactions(user_id)
        intervals = {}
        durations = []

        # print("total number of logs", len(logs))


        #log1:    action1   action2   action3       ...      action(n-1) 
        #log2:    action2   action3   ...     action(n-1)    actionn       
        for i in range(len(logs) - 1):  
            log1 = logs[i]
            log2 = logs[i+1]

            # Leave individual rating page, ignore the interval
            if log1['interaction_type'] ==  InteractionTypes['HIDDEN'] or log1['interaction_type'] ==  InteractionTypes['LOGOUT'] \
                or log1['interaction_type'] ==  InteractionTypes['LEAVE'] or log1['interaction_type'] ==  InteractionTypes['CLOSE'] : 
                continue


            # The second log is page visiable , ignore the interval
            # Usually visiable event should follows a hidden event which is handled, have this additional test incase something goes wrong such that a hidden event is not logged 
            if log2['interaction_type'] ==  InteractionTypes['VISIBLE']:
                continue

            # interview phase, ignore the interval
            # if log1['applicant_group'] == 'interviews':
            #     # print("ignoreing interviews")
            #     continue

            applicant_id = log1['applicant_id']
            # Since users may read pdfs while the mouse is not on the PDF view,
            # as long as the interactions are within the main view (PDF, profile, comment, and ratings view), consider it as focusing on the current pdf type,
            # assuming that time spent on profile,comment and ratings are very short, adding it to the pdf time will not introduce much noise.
        
            docType = log1['doc_type']  # should be either one of the pdf type or empty(interactions on the nav bar). 
     
            duration = (log2['timestamp'] - log1['timestamp']) / 1000.0 / 60.0
            
            if duration > 0:
                durations.append(duration)

                if applicant_id not in intervals:
                    intervals[applicant_id] = []

                intervals[applicant_id].append({'doc': docType, 'duration': duration })

        res = process_intervals(intervals, durations)
        return res
    else:
        return None

        
        