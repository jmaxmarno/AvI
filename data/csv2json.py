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

Missing categories are marked "unknown"
Missing human stats are assumed to be 0
'''
size_labels = ["Small", "Medium", "Large", "unknown"]
elevation_labels = ["Above 11,000ft", "11,000ft - 10,000ft", "10,000ft - 9,000ft", "9,000ft - 8,000ft", "8,000ft - 7,000ft", "7,000ft - 6,000ft", 'Below 6,000ft', "unknown"]
human_stat_labels = ["caught", "carried", "buried_partly", "buried_fully", "injured", "killed"]

def fix_missing_values(row):
    fixed_row = row
    for index in range(len(row)):
        if not row[index]:
            if index < 11:
                fixed_row[index] = "unknown"
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
        'size' : {},
        'aspect' : {},
        'elevation' :{},
        'human_stats': {}
    }
    for region in categorySets[1]:
        monthDict["region"][region] = 0
    for trigger in categorySets[3]:
        monthDict["trigger"][trigger] = 0
    for weak_layer in categorySets[4]:
        monthDict["weak_layer"][weak_layer] = 0
    for size in size_labels:
        monthDict["size"][size] = 0
    for aspect in categorySets[8]:
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
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                print(f'Column names are {", ".join(row)}')
            else:
                row = fix_missing_values(row)
                year = int(row[0].split("/")[-1])
                month = int(row[0].split("/")[0])
                if year not in avy_dict:
                    avy_dict[year] = {}
                if month not in avy_dict[year]:
                    avy_dict[year][month] = copy.deepcopy(monthDictTemplate)
                else:
                    avy_dict[year][month] = updateMonthDict(avy_dict[year][month], row)
            line_count += 1
    return avy_dict

def updateMonthDict(monthDict, row):
    [date, region, place, trigger, weak_layer, depth, width, verticle, aspect, elevation, coordinates, caught, carried, buried_partly, buried_fully, injured, killed] = row
    # update total_count
    monthDict['total_count'] += 1
    # update categories
    keys = ['region','trigger','weak_layer', 'size', 'aspect', 'elevation']
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
    if width != 'unknown':
        if type(width) != 'int':
            width = int(width.replace(',', '').replace("'","").replace('"',''))
        if width > 600:
            return "Large"
        elif width > 300:
            return "Medium"
        else:
            return 'Small'
    else:
        return 'unknown'

def get_elevation(elevation):
    if elevation != 'unknown':
        if type(elevation) != 'int':
            elevation = int(elevation.replace(',', '').replace("'","").replace('"',''))
        if elevation > 11000:
            return "Above 11,000ft"
        elif elevation > 10000:
            return "11,000ft - 10,000ft"
        elif elevation > 9000:
            return "10,000ft - 9,000ft"
        elif elevation > 8000:
            return "9,000ft - 8,000ft"
        elif elevation > 7000:
            return "8,000ft - 7,000ft"
        elif elevation > 6000:
            return "7,000ft - 6,000ft"
        else:
            return 'Below 6,000ft'
    else:
        return 'unknown'

def debug(avy_dict, test_category):
    input(avy_dict)
    for key,value in avy_dict.items():
        for key2,value2 in value.items():
            print("Year: " + str(key) + ", Month: " + str(key2) + ", " + test_category+ ": " + str(avy_dict[key][key2][test_category]))



def main(csvFile):
    categoryNames, categorySets = getCategoriesandLabels(csvFile)
    monthDictTemplate = makeMonthDictTemplate(categorySets)
    avy_dict = getJSONdata(monthDictTemplate, csvFile)
    debug(avy_dict, "elevation")
     # write to json
    json_name = csvFile[:-4] + ".json"
    with open(json_name, 'w') as json_file:
        json.dump(avy_dict, json_file)

if __name__== "__main__":
    csvFile = 'avalanches.csv'
    main(csvFile)
   


