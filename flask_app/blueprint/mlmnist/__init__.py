from flask import Blueprint
from flask import render_template
from flask import request
import json
from flask_app.blueprint.mlmnist.mnist import mnist_softmax

mnist_softmax.Train()

mlmnist = Blueprint('mlmnist', __name__)


@mlmnist.route('/', methods=['GET'])
def index():
    return render_template('mlmnist/index.html')


@mlmnist.route('/result', methods=['GET', 'POST'])
def result():
    img_data = request.form.get('img_data')
    img_data = json.loads(img_data)

    # 把数字区域居中
    firstCol = 0
    lastCol = 27
    firstRow = 0
    lastRow = 27
    for i in range(28):
        for j in range(28):
            if firstCol == 0 and img_data[j*28+i] != 0:  # j=row,i=col
                firstCol = i
            if lastCol == 27 and img_data[j*28+27-i] != 0:  # j=row,i=col
                lastCol = 27-i
            if firstRow == 0 and img_data[i*28+j] != 0:  # j=col,i=row
                firstRow = i
            if lastRow == 27 and img_data[(27-i)*28+j] != 0:  # j=col,i=row
                lastRow = 27-i
            if firstCol != 0 and lastCol != 27 and firstRow != 0 and lastRow != 27:  # break two loops
                j = 28
                i = 28
    # print(firstCol, lastCol, firstRow, lastRow)
    # for j in range(28):
    #     for i in range(28):
    #         print('%d' % img_data[j*28+i], end='')
    #     print()

    width = lastCol - firstCol + 1
    height = lastRow - firstRow + 1
    firstColFixed = (27 - width) // 2 + 1
    lastColFixed = firstColFixed + width - 1
    firstRowFixed = (27 - height) // 2 + 1
    lastRowFixed = firstRowFixed + height - 1
    img_data_fixed = [0 for _ in range(len(img_data))]
    for i in range(width):
        for j in range(height):
            pos = (firstRow+j)*28+firstCol+i
            posFixed = (firstRowFixed+j)*28+firstColFixed+i
            img_data_fixed[posFixed] = img_data[pos]

    # print(firstColFixed, lastColFixed, firstRowFixed, lastRowFixed)
    # for j in range(28):
    #     for i in range(28):
    #         print('%d' % img_data_fixed[j*28+i], end='')
    #     print()

    res = mnist_softmax.Predict(img_data_fixed)
    if res is None:
        res = 10
    return str(res)
