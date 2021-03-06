'''
Jadie Adams and Max Marno
Utah Avy Data Vis Project 2019
'''
import csv
import json
import re
import copy

'''
JSON structure:
{
year{
    month{
        total_count
        region {}
        trigger {}
        weak_layer {}
        size {}
        aspect {}
        human_stats{
            caught
            carried
            burried_partly
            buried_fully
            injured
            killed
            }
        }
    month ...
    }
year ...
}

Missing categories are marked "Unknown"
Missing human stats are assumed to be 0
'''
trigger_labels = ["Natural", "Skier", "Snowmobiler", "Snowboarder", "Snow Bike", "Hiker", "Snowshoer", "Explosive", "Unknown"];
aspect_labels =  ["North","Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest", "Unknown"];
size_labels = ["Under 100 ft.", "100 - 200 ft.", "Over 200 ft.", "Unknown"]
elevation_labels = ["Above 9,500ft", "8,000ft - 9,500ft", 'Below 8,000ft', "Unknown"]
human_stat_labels = ["caught", "carried", "buried_partly", "buried_fully", "injured", "killed"]

def fix_missing_values(row):
    fixed_row = row
    for index in range(len(row)):
        if not row[index]:
            if index < 11:
                fixed_row[index] = "Unknown"
            else:
                fixed_row[index] = 0
        else:
            if index >= 11:
                fixed_row[index] = int(row[index])
    return fixed_row


def getCategoriesandLabels(csvFile):
    # get all categories
    with open(csvFile) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                categoryNames = row
                categorySets = []
                for index in range(len(categoryNames)):
                    categorySets.append(set())
            else:
                row = fix_missing_values(row)
                for index in range(len(row)):
                    categorySets[index].add(row[index])
            line_count += 1
    return(categoryNames, categorySets)

def makeMonthDictTemplate(categorySets):
    monthDict = {
        'total_count' : 0,
        'region' : {},
        'trigger' : {},
        'weak_layer' : {},
        'width' : {},
        'aspect' : {},
        'elevation' :{},
        'human_stats': {}
    }
    for region in categorySets[1]:
        monthDict["region"][region] = 0
    for trigger in trigger_labels:
        monthDict["trigger"][trigger] = 0
    for weak_layer in categorySets[4]:
        monthDict["weak_layer"][weak_layer] = 0
    for size in size_labels:
        monthDict["width"][size] = 0
    for aspect in aspect_labels:
        monthDict["aspect"][aspect] = 0
    for elevation in elevation_labels:
        monthDict["elevation"][elevation] = 0
    for human_stat in human_stat_labels:
        monthDict["human_stats"][human_stat] = 0
    return monthDict

def getJSONdata(monthDictTemplate, csvFile):
    # make dictionary
    avy_dict = {}
    with open(csvFile) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        rows = list(csv_reader)
        end_year = int(rows[1][0].split("/")[-1])
        end_month = int(rows[1][0].split("/")[0])
        start_year =  int(rows[-1][0].split("/")[-1])
        start_month =  int(rows[-1][0].split("/")[0])
        # add month templates
        for year in range(start_year, end_year+1):
            avy_dict[year] = {}
            start = 1
            end = 12
            if year == start_year:
                start = start_month
            elif year == end_year:
                end = end_month
            for month in range(start, end + 1):
                avy_dict[year][month] = copy.deepcopy(monthDictTemplate)
        # update months
        for row in rows[1:]:
            row = fix_missing_values(row)
            year = int(row[0].split("/")[-1])
            month = int(row[0].split("/")[0])
            avy_dict[year][month] = updateMonthDict(avy_dict[year][month], row)
    print(str(len(rows)-1) + " observations added to json")
    return avy_dict

def updateMonthDict(monthDict, row):
    [date, region, place, trigger, weak_layer, depth, width, verticle, aspect, elevation, coordinates, caught, carried, buried_partly, buried_fully, injured, killed] = row
    # update total_count
    monthDict['total_count'] += 1
    # update categories
    keys = ['region','trigger','weak_layer', 'width', 'aspect', 'elevation']
    new_values = [region, trigger, weak_layer, get_size(depth,width,verticle), aspect, get_elevation(elevation)]
    for index in range(len(keys)):
        key = keys[index]
        new_value = new_values[index]
        monthDict[key][new_value] += 1
    # update human stats
    monthDict['human_stats']['caught'] += caught
    monthDict['human_stats']['carried'] += carried
    monthDict['human_stats']['buried_partly'] += buried_partly
    monthDict['human_stats']['buried_fully'] += buried_fully
    monthDict['human_stats']['injured'] += injured
    monthDict['human_stats']['killed'] += killed
    return monthDict

def get_size(depth,width,verticle):
    if width != 'Unknown':
        if type(width) != 'int':
            width = int(width.replace(',', '').replace("'","").replace('"',''))
        if width > 200:
            return "Over 200 ft."
        elif width > 100:
            return "100 - 200 ft."
        else:
            return 'Under 100 ft.'
    else:
        return 'Unknown'

def get_elevation(elevation):
    if elevation != 'Unknown':
        if type(elevation) != 'int':
            elevation = int(elevation.replace(',', '').replace("'","").replace('"',''))
        if elevation > 9500:
            return "Above 9,500ft"
        elif elevation > 8000:
            return "8,000ft - 9,500ft"
        else:
            return 'Below 8,000ft'
    else:
        return 'Unknown'

def debug(avy_dict, test_category):
    for key,value in avy_dict.items():
        for key2,value2 in value.items():
            print("Year: " + str(key) + ", Month: " + str(key2) + ", " + test_category+ ": " + str(avy_dict[key][key2][test_category]))



def main(csvFile):
    categoryNames, categorySets = getCategoriesandLabels(csvFile)
    monthDictTemplate = makeMonthDictTemplate(categorySets)
    avy_dict = getJSONdata(monthDictTemplate, csvFile)
    # debug(avy_dict, "size")
     # write to json
    json_name = csvFile[:-4] + ".json"
    with open(json_name, 'w') as json_file:
        json.dump(avy_dict, json_file)

if __name__== "__main__":
    csvFile = 'avalanches.csv'
    main(csvFile)
