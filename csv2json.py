'''
Jadie Adams and Max Marno
Utah Avy Data Vis Project 2019
'''
import csv
import json
import re

'''
JSON structure:
{
year{
    month{
        total_count
        place {}
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

def createMonthDict(row):
    [date, region, place, trigger, weak_layer, depth, width, verticle, aspect, elevation, coordinates, caught, carried, buried_partly, buried_fully, injured, killed] = row
    monthDict = {
        'total_count' : 1,
        'region' : {region:1},
        'place' : {place:1},
        'trigger' : {trigger:1},
        'weak_layer' : {weak_layer:1},
        'size' : {get_size(depth,width,verticle):1},
        'aspect' : {aspect:1},
        'elevation' :{get_elevation(elevation):1},
        'human_stats': {
            'caught' : caught,
            'carried' : carried,
            'buried_partly' : buried_partly,
            'buried_fully' : buried_fully,
            'injured' : injured,
            'killed' : killed
        }
    }
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

def updateMonthDict(monthDict, row):
    [date, region, place, trigger, weak_layer, depth, width, verticle, aspect, elevation, coordinates, caught, carried, buried_partly, buried_fully, injured, killed] = row
    # update total_count
    monthDict['total_count'] += 1
    # update categories
    keys = ['region', 'place','trigger','weak_layer', 'size', 'aspect', 'elevation']
    new_values = [region, place, trigger, weak_layer, get_size(depth,width,verticle), aspect, get_elevation(elevation)]
    for index in range(len(keys)):
        key = keys[index]
        new_value = new_values[index]
        if new_value not in monthDict[key]:
            monthDict[key][new_value] = 1
        else:
            monthDict[key][new_value] += 1
    # update human stats
    monthDict['human_stats']['caught'] += caught
    monthDict['human_stats']['carried'] += carried
    monthDict['human_stats']['buried_partly'] += buried_partly
    monthDict['human_stats']['buried_fully'] += buried_fully
    monthDict['human_stats']['injured'] += injured
    monthDict['human_stats']['killed'] += killed
    return monthDict

def main(csvFile):
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
                    avy_dict[year][month] = createMonthDict(row)
                else:
                    avy_dict[year][month] = updateMonthDict(avy_dict[year][month], row)
            line_count += 1
    #debug
    test_category = 'size'
    for key,value in avy_dict.items():
        for key2,value2 in value.items():
            print("Year: " + str(key) + ", Month: " + str(key2) + ", " + test_category+ ": " + str(avy_dict[key][key2][test_category]))
    # write to json
    json_name = csvFile[:-4] + ".json"
    with open(json_name, 'w') as json_file:
        json.dump(avy_dict, json_file)




if __name__== "__main__":
    csvFile = 'avalanches.csv'
    main(csvFile)
   


