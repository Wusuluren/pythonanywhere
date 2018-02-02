# Copyright 2015 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

"""A very simple MNIST classifier.

See extensive documentation at
https://www.tensorflow.org/get_started/mnist/beginners
"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import sys
import numpy
import os

from tensorflow.examples.tutorials.mnist import input_data
import tensorflow as tf

FLAGS = None
SESS = None
X = Y = None


def main(_):
    global FLAGS, SESS, X, Y
    # Import data
    mnist = input_data.read_data_sets(FLAGS.data_dir, one_hot=True)

    # Create the model
    X = tf.placeholder(tf.float32, [None, 784], name="X")
    W = tf.Variable(tf.zeros([784, 10]), name="W")
    b = tf.Variable(tf.zeros([10]), name="b")
    Y = tf.add(tf.matmul(X, W), b, name="Y")

    # Define loss and optimizer
    y_ = tf.placeholder(tf.float32, [None, 10])

    # The raw formulation of cross-entropy,
    #
    #   tf.reduce_mean(-tf.reduce_sum(y_ * tf.log(tf.nn.softmax(y)),
    #                                 reduction_indices=[1]))
    #
    # can be numerically unstable.
    #
    # So here we use tf.nn.softmax_cross_entropy_with_logits on the raw
    # outputs of 'y', and then average across the batch.
    cross_entropy = tf.reduce_mean(
        tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=Y))
    train_step = tf.train.GradientDescentOptimizer(0.5).minimize(cross_entropy)

    sess = tf.InteractiveSession()
    tf.global_variables_initializer().run()
    saver = tf.train.Saver(max_to_keep=1)
    # Train
    for _ in range(1000):
        batch_xs, batch_ys = mnist.train.next_batch(100)
        sess.run(train_step, feed_dict={X: batch_xs, y_: batch_ys})

    print(saver.save(sess, "save/mnist_softmax.ckpt"))

    # Test trained model
    correct_prediction = tf.equal(tf.argmax(Y, 1), tf.argmax(y_, 1))
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
    print(sess.run(accuracy, feed_dict={X: mnist.test.images,
                                        y_: mnist.test.labels}))
    SESS = sess


def Train():
    global FLAGS, SESS, X, Y

    if os.path.exists('save/mnist_softmax.ckpt.meta'):
        saver = tf.train.import_meta_graph("save/mnist_softmax.ckpt.meta")
        graph = tf.get_default_graph()
        sess = tf.Session()
        X = graph.get_tensor_by_name("X:0")
        # W = graph.get_tensor_by_name("W:0")
        # b = graph.get_tensor_by_name("b:0")
        Y = graph.get_tensor_by_name("Y:0")
        saver.restore(sess, "save/mnist_softmax.ckpt")
        SESS = sess
        return

    parser = argparse.ArgumentParser()
    parser.add_argument('--data_dir', type=str, default='/tmp/tensorflow/mnist/input_data',
                      help='Directory for storing input data')
    FLAGS, unparsed = parser.parse_known_args()
    # tf.app.run(main=main, argv=[sys.argv[0]] + unparsed)
    main([sys.argv[0]] + unparsed)


def Predict(data):
    global FLAGS, SESS, X, Y
    data = [1 if i % 28 == 0 else 0 for i in range(28 * 28)]
    px = numpy.array(data).reshape(1, 784)
    predictions = tf.argmax(Y, 1)
    res = SESS.run(predictions, feed_dict={X: px})
    print(res)
    return res[0]


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data_dir', type=str, default='/tmp/tensorflow/mnist/input_data',
                        help='Directory for storing input data')
    FLAGS, unparsed = parser.parse_known_args()
    tf.app.run(main=main, argv=[sys.argv[0]] + unparsed)
