try:
    from scripts.objects import Class, mockStudent, json_to_student
    from scripts.database import open_database
except Exception as e:
    from objects import Class, mockStudent, json_to_student
    from database import open_database

core_key = 'core'
following_key = 'following'
prerequisite_key = 'prerequisites'
elective_key = 'electives'
additional_key = 'additional'
unsure_key = 'unsure'
keys_to_fill = [core_key, following_key, prerequisite_key]
special_topics_in_computer_science = "CS 6301"
algorithms_and_data_structures = "CS 5343"


def test_strings(database_string, transcript_string):
    if (database_string == ''):
        return False
    if (transcript_string == ''):
        return False
    return transcript_string.lower().strip() in database_string.lower().strip()


grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-',
          'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', '']


def grade_key(obj):
    try:
        return grades.index(obj.grade)
    except ValueError:
        return grades.index('')


def type_key(obj):
    types = [core_key, following_key, elective_key,
             additional_key, prerequisite_key, unsure_key, '']
    try:
        return types.index(obj.type)
    except ValueError:
        return types.index('')

# Rank prerequisites, prioritize algorithms


def is_prerequisite_higher_rank(class_one, class_two):
    try:
        grade_one = class_one.grade.split('/')[-1]
        grade_two = class_two.grade.split('/')[-1]
        if not grade_one:
            return False
        rank_one = grades.index(grade_one)
        rank_two = grades.index(grade_two)
        if rank_one == rank_two:
            return class_one.number == "CS 5343"  # prioritize algorithms
        return rank_one < rank_two
    except Exception as e:
        return False

# FINDS CLASS IN ONE OF THE TYPELISTS, CHANGES NAME


def assign_name(class_name, type_list):
    for i in range(0, len(type_list)):
        # exists in typeList, replace studentObj's name w/ typeList[name] and go back
        if (test_strings(class_name.number, type_list[i]['id'])):
            class_name.name = type_list[i]['name']
            break


def get_alias(database_class):
    try:
        return database_class['alias']
    except KeyError:
        return ''


def find_add_classes(replacement_classes, class_list, type_list, type_key):
    found = False
    for j in range(0, len(type_list)):
        for i in range(0, len(class_list)):
            found = False
            # finds class w/i database, assigns type
            alias = get_alias(type_list[j])
            if (test_strings(class_list[i].number, type_list[j]['id']) or test_strings(class_list[i].number, alias)):
                class_list[i].type = type_key
                # assign name from DB here
                class_list[i].name = type_list[j]['name']
                found = True
                break
        # student hasn't take the class yet, store as a new class to add to classes[] list later
        if (not found and type_key in keys_to_fill):
            replacement_classes.append(
                Class(type_list[j]['name'], type_list[j]['id'], '', '', '', '', type_key, ''))


def append_class_grade_and_semester(old_obj, new_obj):
    old_grade = old_obj.grade if old_obj.grade != '' else '?'
    old_semester = old_obj.semester if old_obj.semester != '' else '?'
    new_grade = new_obj.grade if new_obj.grade != '' else '?'
    new_semester = new_obj.semester if new_obj.grade != '' else '?'

    # if new obj doesn't have grade and semester
    if new_grade == '?' and new_semester == '?':
        return

    # if old object doesn't have anything, give new and return
    if old_grade == '?' and old_semester == '?':
        old_obj.grade = new_obj.grade
        old_obj.semester = new_obj.semester
        return

    old_obj.grade = new_grade + '/' + old_grade
    old_obj.semester = new_semester + '/' + old_semester

    # we also need to place this in the higher precedence table
    if (new_obj.type == core_key or new_obj.type == following_key):
        old_obj.type = new_obj.type


def make_empty_class_from_existing(class_obj, table, note=''):
    return Class(class_obj.name, class_obj.number, note, '', '', '', table, '')


def designateClassesMethod(student_object):
    try:
        if (student_object == 'mock'):
            student_object = mockStudent(unsure=True)
        else:
            student_object = json_to_student(student_object)

        data = open_database()
        cores = []
        following = []
        prerequisites = []
        track_list = data['tracks']
        num_of_following = 0
        replacement_classes = []

        # EXTRACTING CORRECT TRACK FROM DB
        for track in range(len(track_list)):
            if (track_list[track]['name'] == student_object.track):
                cores = track_list[track][core_key]
                num_of_following = track_list[track]["N-of-the-following"]
                following = track_list[track][following_key]
                prerequisites = track_list[track][prerequisite_key]

        # UPDATING STUDENT'S CLASS TYPES, ADD IF NOT TAKEN
        find_add_classes(replacement_classes,
                         student_object.classes, cores, core_key)
        find_add_classes(replacement_classes,
                         student_object.classes, following, following_key)
        find_add_classes(replacement_classes, student_object.classes,
                         prerequisites, prerequisite_key)

        # UPDATE ALL UNTYPED TO 'ELECTIVES'
        for i in range(0, len(student_object.classes)):
            if (test_strings(student_object.classes[i].type, unsure_key)):
                student_object.classes[i].type = elective_key

        # COMBINE THE CLASSES, SORT BY GRADE
        student_object.classes = sorted(student_object.classes, key=grade_key)

        # EDGE CASES
        count = 0
        class_dict = {}
        indexes = []
        best_prerequisite_index = -1
        for index, class_obj in enumerate(student_object.classes):

            # CHECK FOR DUPLICATES
            if class_obj.number in class_dict and not test_strings(class_obj.number, special_topics_in_computer_science):
                found_obj = student_object.classes[class_dict[class_obj.number]]
                append_class_grade_and_semester(found_obj, class_obj)
                continue

            indexes.append(index)
            class_dict[class_obj.number] = index

            # FIND THE HIGHEST GRADE PREREQUISITE, prioritize "CS 5343"
            if class_obj.type == prerequisite_key and class_obj.grade:
                if best_prerequisite_index < 0 or is_prerequisite_higher_rank(class_obj, student_object.classes[best_prerequisite_index]):
                    best_prerequisite_index = index

            if class_obj.type != following_key or (not class_obj.grade and not class_obj.semester):
                continue

            # ENSURE THAT ONLY N AMOUNT OF GRADED CLASSES IN FOLLOWING
            if count >= num_of_following:
                class_obj.type = elective_key
                replacement_classes.append(
                    make_empty_class_from_existing(class_obj, following_key))
                continue

            # ENSURE THAT SPECIAL TOPICS IS NOT A GRADED CLASS IN FOLLOWING
            if test_strings(class_obj.number, special_topics_in_computer_science) and class_obj.type == following_key:
                replacement_classes.append(
                    make_empty_class_from_existing(class_obj, class_obj.type, "See Above"))
                class_obj.type = elective_key
                continue

            count = count + 1

        # EDGE CASES PT. 2
        class_list = []
        for index, class_obj in enumerate(student_object.classes):
            if index in indexes:
                # CHANGING THE CAPITALS - electives won't be in DB
                class_obj.name = (class_obj.name).title()
                if class_obj.type == elective_key:  # current class type == elective, make it title case; non-electives are handled above
                    if test_strings(class_obj.number, special_topics_in_computer_science):
                        class_obj.name = class_obj.name.split('[')[0]

                # put best prerequisite in additional table
                if index == best_prerequisite_index:
                    class_obj.type = additional_key
                    replacement_classes.append(
                        make_empty_class_from_existing(class_obj, prerequisite_key))

                class_list.append(class_obj)

        # Add classes at bottom that are empty i.e. no grade
        class_list.extend(replacement_classes)

        # SORT BY TABLE
        student_object.classes = sorted(class_list, key=type_key)

        # for i in range(0, len(student_object.classes)):
        # print(f"{student_object.classes[i].type} {student_object.classes[i].name} {student_object.classes[i].number} {student_object.classes[i].grade} {student_object.classes[i].semester}")
        return student_object.packStudentObject()
    except Exception as e:
        raise Exception("Error: Error At Track Selection.")


if __name__ == '__main__':
    print(designateClassesMethod('mock'))
