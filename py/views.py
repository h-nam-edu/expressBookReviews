from django.shortcuts import render, get_object_or_404, redirect
from .models import Course, Question, Choice, Submission

def submit(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    
    if request.method == 'POST':
        score = 0
        total_score = 0
        
        # Grade the submission
        for question in course.question_set.all():
            total_score += question.grade
            selected_choice_id = request.POST.get(f'question_{question.id}')
            
            if selected_choice_id:
                selected_choice = Choice.objects.get(pk=selected_choice_id)
                if selected_choice.is_correct:
                    score += question.grade
        
        # Calculate percentage
        percentage = (score / total_score) * 100 if total_score > 0 else 0
        
        # Pass data to session to use in the result view
        request.session['exam_score'] = score
        request.session['exam_percentage'] = percentage
        
        return redirect('show_exam_result', course_id=course.id)
        
    return render(request, 'exam_template.html', {'course': course})


def show_exam_result(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    score = request.session.get('exam_score', 0)
    percentage = request.session.get('exam_percentage', 0)
    
    # 70% is required to pass
    passed = percentage >= 70 
    
    context = {
        'course': course,
        'score': score,
        'percentage': percentage,
        'passed': passed
    }
    return render(request, 'exam_result.html', context)