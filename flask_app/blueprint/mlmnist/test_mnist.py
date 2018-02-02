# from flask_app.blueprint.mlmnist.mnist import mnist_softmax
from mnist import mnist_softmax

mnist_softmax.Train()

test_data = [1 if i%28==0 else 0 for i in range(28*28)]
# print(test_data)
for j in range(28):
    for i in range(28):
        print('%d' % test_data[j*28+i], end='')
    print()
res = mnist_softmax.Predict(test_data)
if res is None:
    res = 10
print(res)